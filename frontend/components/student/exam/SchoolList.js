import {
    Avatar,
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
    Badge, Button,
} from '@mui/material';
import Link from 'next/link'
import Image from 'next/image'
import AppliedStatus from "../../AppliedStatus";
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";

const SchoolList = ({ pageIndex, setPageIndex, schools, status }) => {

    function statusText(s){
        let text = 'Apply for Examination'
        if(s === 'Pending'){
            text = 'Click to View'
        }else if(s === 'Accepted'){
            text = 'Start Exam'
        }
        return text
    }

    return (
        <>
            <Box>
                <Paper style={{ overflowX: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: '300px' }}>
                                    School
                                </TableCell>
                                <TableCell style={{ minWidth: '170px' }} align="center">
                                    Status
                                </TableCell>
                                {status !== 'Rejected' && (
                                    <TableCell style={{ minWidth: '190px', width: '190px' }} />
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schools?.count === 0 && (
                                <TableRow>
                                    <TableCell colSpan="3">
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
                                            }}
                                        >
                                            <Image
                                                src={school.logo_url ? school.logo_url: '/static/images/default.png' }
                                                width={40}
                                                height={40}
                                                alt="logo"
                                                placeholder="blur"
                                                blurDataURL="/static/images/default.png"
                                                objectFit="contain"
                                            />
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                                ml={1}
                                            >
                                                {school.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <AppliedStatus status={school.status}/>
                                    </TableCell>
                                    {status !== 'Rejected' && (
                                        <TableCell align="center">
                                            <Link href={`/u/exam/details/${school?.id}`} passHref>
                                                <MuiLink>
                                                    {statusText(school.status)}
                                                </MuiLink>
                                            </Link>
                                        </TableCell>
                                    )}
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
        </>
    );
}

export default SchoolList
