import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Link as MuiLink,
    Pagination,
    Avatar, Button, CircularProgress,
} from '@mui/material';
import CustomDialog from "../../CustomDialog";
import {
    Add as AddIcon
} from '@mui/icons-material'
import Link from 'next/link'
import Image from 'next/image'
import axiosInstance from "../../../utils/axiosInstance";
import { useState} from 'react'
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";


export default function SchoolList({ pageIndex, setPageIndex, schools, mutate, isValidating }){

    const [openDialog, setOpenDialog] = useState(false)

    const [ todelete , setTodelete] = useState({
        id: '',
        schoolname: '',
        loading: false,
        message: '',
    })


    async function onClickConfirm(){
        setOpenDialog(false)
        setTodelete({ ...todelete, loading: true, message: 'Deleting..' })
        await axiosInstance.delete(`myadmin/schools/${todelete.id}/`).then((_r) => {
            mutate()
            setTodelete({ id: '', schoolname: '', loading: false, message: 'Successfully Deleted.' })
        }).catch((_e) => {
            setTodelete({ id: '', schoolname: '', loading: false, message: 'Something went wrong failed to delete.' })
        })
    }


    const onClickPreview = (id, name) =>  {
        setTodelete({ id: id, schoolname: name, loading: false, message: '' })
        setOpenDialog(true)
    }



    return (
        <>
            <Card>
                <CustomDialog
                    onClickConfirm={onClickConfirm}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    onClickPreview={onClickPreview}
                    title={'Are you sure you want to delete?'}
                    content={`Click confirm to delete ${todelete.schoolname}`}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 2,
                        mr: 2,
                        ml: 2,
                    }}>
                    {todelete.message ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {todelete.loading && (
                                <CircularProgress size={20} sx={{ mr: 1 }}/>
                            )}
                            {todelete.message}
                        </Box>
                    ): (
                        isValidating ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 1 }}/>Loading..
                            </Box>
                        ): ( <div/>)
                    )}
                    <Link href={`/a/school/create`} passHref>
                        <MuiLink sx={{
                            color: 'white',
                            textDecoration: 'none',
                        }}>
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<AddIcon/>}
                            >
                                New School
                            </Button>
                        </MuiLink>
                    </Link>

                </Box>
                <Box>
                    <Paper style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ minWidth: '300px' }}>
                                        School
                                    </TableCell>
                                    <TableCell style={{ minWidth: '200px' }}>
                                        Email
                                    </TableCell>
                                    <TableCell style={{ minWidth: '250px' }}>
                                        Description
                                    </TableCell>
                                    <TableCell style={{ minWidth: '120px' }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schools?.count === 0 && (
                                    <TableRow>
                                        <TableCell colSpan="5">
                                            <Typography variant="body1" textAlign="center">
                                                No data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {schools?.results?.map((school, i) => (
                                    <TableRow
                                        hover
                                        key={school.id}
                                    >
                                        <TableCell>
                                            <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex'
                                            }}>
                                                <Image
                                                    src={school.logo_url ? school.logo_url: '/static/images/default.png' }
                                                    width={40}
                                                    height={40}
                                                    alt="logo"
                                                    quality={80}
                                                    objectFit="cover"/>
                                                <Typography
                                                    color="textPrimary"
                                                    variant="body1"
                                                    sx={{ ml: 2 }}
                                                >
                                                    {school.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {school.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {school.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}>
                                                <Box>
                                                    <Link href={`/a/school/${school?.id}`} passHref>
                                                        <MuiLink sx={{marginRight: '10px'}}>
                                                            Update
                                                        </MuiLink>
                                                    </Link>
                                                </Box>
                                                <Box
                                                    onClick={() => onClickPreview(school?.id, school?.name)}
                                                    >
                                                    <MuiLink >
                                                        Delete
                                                    </MuiLink>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
                <Box
                    my={2}
                    mr={1}
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        rowGap: '10px',
                    }}
                >
                    <Box sx={{ mr: 1 }}>
                        {paginationRecordCount(pageIndex, schools?.count)}
                    </Box>
                    <Pagination count={schools?.count ? Math.ceil(schools?.count/PAGINATION_COUNT) : 0}
                                page={pageIndex}
                                color="primary"
                                onChange={(_e, n) => {
                                    setPageIndex(n)
                                }}/>
                </Box>
            </Card>
        </>
    );
}