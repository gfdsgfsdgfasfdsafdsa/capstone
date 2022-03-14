import { useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { NavItem } from './NavItem';
import Image from 'next/image';
import { Logout } from '@mui/icons-material';
import {userRole, getRole} from "../config/userRole";

export const DashboardSidebar = (props) => {

    const { open, onClose, items, user, logout } = props;
    const router = useRouter();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
        defaultMatches: true,
        noSsr: false
    });


    useEffect(() => {

        if (!router.isReady) {
            return;
        }

        if (open) {
            onClose?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [router.asPath]);
    
    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <div>
                    <Box sx={{
                        pt: 2,
                        ml: -1,
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        {getRole(user?.type) === userRole.SCHOOLADMIN && (
                            <Box sx={{
                                maxWidth: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image
                                    src={user?.logo ? user.logo : "/static/images/default.png"}
                                    alt="Picture of the author"
                                    width={70}
                                    height={70}
                                    quality={100}
                                    placeholder="blur"
                                    blurDataURL="/static/images/default.png"
                                    objectFit="cover"
                                />
                                <Typography variant="h6" textAlign="center"
                                            sx={{ mt: 2 }}>
                                    {user.school}
                                </Typography>
                            </Box>
                        )}
                        {getRole(user?.type) === userRole.STUDENT && (
                            <>
                                <Box sx={{
                                    maxWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Typography variant="h6"
                                                sx={{ mt: 2 }}>
                                        {user.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1">
                                        {user.strand}
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {getRole(user?.type) === userRole.ADMIN && (
                            <>
                                <Box sx={{
                                    maxWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Typography variant="h6"
                                                sx={{ mt: 2 }}>
                                        {user.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1">
                                        Admin
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </div>
                <Divider
                    sx={{
                        borderColor: '#2D3748',
                        my: 2,
                    }}
                />
                <Typography
                    variant="cool"
                    sx={{ ml: 1 }}
                >
                    Menu
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    {items?.map((item, i) => {
                        return(
                            <Fragment key={item.title}>
                                {item.i === i && (
                                    <Typography
                                                variant="cool"
                                                sx={{ ml: 1 }}
                                    >
                                        Settings
                                    </Typography>
                                )}
                                <NavItem
                                    icon={item.icon}
                                    href={item.url}
                                    title={item.title}
                                />
                            </Fragment>
                        )
                    })}
                    <NavItem
                        key='Logout'
                        icon={<Logout/>}
                        href="/"
                        onClick={() => logout()}
                        title='Logout'
                    />
                </Box>
                <Divider sx={{ borderColor: '#2D3748' }} />
            </Box>
        </>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.900',
                        color: '#FFFFFF',
                        width: 270
                    }
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.900',
                    color: '#FFFFFF',
                    width: 270
                }
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

