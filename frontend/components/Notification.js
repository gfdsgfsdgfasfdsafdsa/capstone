import {useCallback, useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/router';
import {
  Notifications as NotificationsIcon,
  Markunread as MarkunreadIcon,
} from '@mui/icons-material'
import {
    Box,
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Badge,
    CircularProgress,
    Typography,
    Link as MuiLink
} from "@mui/material";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import {NOTIFICATION_COUNT} from "../config/settings";
import Link from 'next/link'
import {DateTime} from "luxon";
import AxiosInstance from "../utils/axiosInstance";

const Notification = ({ isStudent }) => {
    const notifQuery = isStudent ? 'student/notification/' : 'school/notification/'

    const { data: notif, mutate: notifMutate } = useSWR(notifQuery, {
        refreshInterval: 100000,
    });
    const [loadingReadAll, setLoadingReadAll] = useState(false)

    const getKey = (pageIndex, previousPageData) => {
        pageIndex = pageIndex + 1
        if((pageIndex * NOTIFICATION_COUNT) - NOTIFICATION_COUNT + 1 > notif?.count)
            return null

        let query = ''

        return `${notifQuery}details/?page=${pageIndex}`
    }
    const [anchorEl, setAnchorEl] = useState(null);

    const { data: notifDetails, isValidating, mutate, size, setSize } = useSWRInfinite(
        getKey,
        { revalidateOnFocus: false }
    )
    const latestMutate = useRef(mutate)
    latestMutate.current = mutate
    const [notifD, setNotifD] = useState(notifDetails ? notifDetails?.flat(): null)

    useEffect(() => {
        setNotifD(notifDetails?.flat())
    }, [notifDetails, anchorEl])

    const observer = useRef()
    const lastNotifElementRef = useCallback(node => {
        if(isValidating) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && ((size * NOTIFICATION_COUNT) - NOTIFICATION_COUNT + 1) <= notif?.count){
                setSize(size + 1)
            }
        })
        if(node) observer.current.observe(node)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValidating, size, setSize, notif?.count])

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        latestMutate.current()
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function markAllRead(){
        if(loadingReadAll) return false
        setLoadingReadAll(true)
        let d = [...notifD]
        if(isStudent){
            for(let i = 0; i < notifD.length; i++){
                if(d[i].is_seen_by_student) continue

                d[i].is_seen_by_student = true
            }
        }else{
            for(let i = 0; i < notifD.length; i++){
                if(d[i].is_seen_by_school) continue

                d[i].is_seen_by_school = true
            }
        }
        setNotifD(d)
        await notifMutate({ ...notif, not_seen_count: 0 }, false)
        await AxiosInstance.put(`${notifQuery}details/`, { 'read_all': '1' })
            .then((_r) => {
                setLoadingReadAll(false)
            }).catch((_e) => {
                setLoadingReadAll(false)
            })
    }

    async function seenNotif(i, id){
        //Close notif
        handleClose()

        let d = [...notifD]
        if(isStudent){
            if(d[i].is_seen_by_student) return

            d[i].is_seen_by_student = true
        }else{
            if(d[i].is_seen_by_school) return

            d[i].is_seen_by_school = true
        }
        setNotifD(d)
        //Bound mutate
        await notifMutate({ ...notif, not_seen_count: notif?.not_seen_count - 1 }, false)
        await AxiosInstance.put(`${notifQuery}details/`, { 'id': id })
            .then((_r) => {}
            ).catch((_e) => {})
    }

    function notifItem(id, i, name, isSeen, dt, status, lastItem){
        let href = isStudent ? `/u/exam/?name=${name}&status=${status}`
            : `/s/applied/?name=${name}&status=${status}`
        return(
            <Link
                href={href}
                passHref
                key={id}
            >
                <MuiLink
                    onClick={() => seenNotif(i, id)}
                    sx={{
                        textDecoration: 'none',
                        color: 'unset',
                    }}
                >
                    <MenuItem
                        sx={{
                            backgroundColor: isSeen ? '#fff': '#f0f0f0',
                            borderBottom: '1px solid #d1d1d1'
                        }}
                    >
                        <Box
                            sx={{
                                px: 1,
                                py: 1,
                            }}
                        >
                            <Badge
                                color="primary"
                                variant={isSeen ? "circle" : "dot"}
                                sx={{
                                    position: 'absolute',
                                    right: 20,
                                    left: 20,
                                }}
                            />
                            <Typography
                                component="span"
                                variant="subtitle2"
                                fontSize="0.875rem"
                                sx={{ whiteSpace: 'pre-line' }}
                            >
                                {name}
                                <Typography
                                    sx={{ marginLeft: '4px' }}
                                    component="span"
                                    variant="body2"
                                >
                                    {isStudent ? `has ${status} your request.` : 'has requested to take the exam'}
                                </Typography>
                            </Typography>
                            <Typography
                                ref={lastItem ? lastNotifElementRef : null}
                                variant="caption"
                                fontSize="0.875rem"
                                component="div"
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#6B72890'
                                }}
                            >
                                {DateTime.fromISO(dt).toFormat('LLL. dd yyyy hh:mm a')}
                            </Typography>
                        </Box>
                    </MenuItem>
                </MuiLink>
            </Link>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Notifications">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{
                            ml: 2,
                            backgroundColor: "#8f8f8f",
                            "&:hover": {
                                backgroundColor: "#8f8f8f"
                            }
                        }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Badge
                            badgeContent={notif ? notif.not_seen_count : 0}
                            color="primary"
                        >
                            <NotificationsIcon sx={{ color: '#fff' }}/>
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: 380,
                        border: '1px solid #c9c9c9',
                        borderTop: 'none',
                        borderRadius: 8,
                        overflowY: 'scroll',
                        height: 'auto',
                        maxHeight: 400,
                    },
                    elevation: 0,
                    sx: {
                        mt: 0.6,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '& .MuiMenu-list': {
                            padding:0,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 24px',
                        backgroundColor: '#5048E5',
                    }}
                >
                    <Typography
                        variant="h6"
                        color="white"
                        fontSize="1.0909rem"
                        component="div"
                    >
                        Notifications
                        <Typography
                            variant="caption"
                            color="white"
                            component="p"
                        >
                            Click to view
                        </Typography>
                    </Typography>
                    <IconButton
                        onClick={markAllRead}
                    >
                        {/*
                        <Tooltip title="">
                            <MarkunreadIcon
                                sx={{ color: '#fff' }}
                            />
                        </Tooltip>
                        */}
                        <Typography
                            variant="caption"
                            color="white"
                            sx={{
                                textDecoration: "underline",
                                ":hover": {
                                    color: '#dedede'
                                }
                            }}
                        >
                            Mark all as read
                        </Typography>
                    </IconButton>
                </Box>
                {notifD?.length === 0 && (
                    <MenuItem
                    >
                        <Typography
                            fontSize="0.875rem"
                            sx={{
                                px: 1,
                                py: 1,
                            }}
                        >
                            No notification
                        </Typography>
                    </MenuItem>
                )}
                {notifD?.map((i, j) => {
                    let seen = i.is_seen_by_school
                    let name = i?.student?.name
                    let date = i?.datetime_created
                    if(isStudent){
                        seen = i.is_seen_by_student
                        name = i.school.name
                        date = i?.datetime_modified
                    }
                    if (notifD.length === j + 1)
                        return notifItem(i.id, j, name, seen, date, i.status, true)
                    else
                        return notifItem(i.id, j, name, seen, date, i.status, false)
                })}
                {((size * NOTIFICATION_COUNT) - NOTIFICATION_COUNT + 1) > notif?.count ? (
                    <MenuItem
                    >
                        <Typography
                            fontSize="0.875rem"
                            sx={{
                                px: 1,
                                py: 1,
                            }}
                        >
                            No more items to load.
                        </Typography>
                    </MenuItem>
                ):(
                    isValidating && (
                        <MenuItem
                        >
                            <Typography
                                fontSize="0.875rem"
                                sx={{
                                    px: 1,
                                    py: 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                component="div"
                            >
                                <CircularProgress sx={{ mr: 2}} size={20}/> Getting more data..
                            </Typography>
                        </MenuItem>
                    )
                )}
            </Menu>

        </>
    );
}

export default Notification
