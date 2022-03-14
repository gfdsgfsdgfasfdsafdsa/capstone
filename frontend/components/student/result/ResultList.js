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
    Stack,
} from '@mui/material';
import Link from 'next/link'
import Image from 'next/image'
import {DateTime} from "luxon";
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";

const ResultList = ({ pageIndex, setPageIndex, results }) => {
    return (
        <>
            <Card>
                <Box>
                    <Paper style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '150px' }}>
                                        Date Taken
                                    </TableCell>
                                    <TableCell style={{ minWidth: '200px' }}>
                                        School
                                    </TableCell>
                                    <TableCell style={{ minWidth: '190px', width: '190px' }}>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results?.count === 0 && (
                                    <TableRow>
                                        <TableCell colSpan="3">
                                            <Typography variant="body1" textAlign="center">
                                                No data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {results?.results?.map((r) => (
                                    <TableRow
                                        hover
                                        key={r.id}
                                    >
                                        <TableCell>
                                            {DateTime.fromISO(r.date_taken).toFormat('LLL. dd yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Image
                                                    src={r.school_logo ? r.school_logo : "/static/images/default.png"}
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
                                                    {r.school_name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/u/results/${r?.school_id}`} passHref>
                                                <MuiLink>
                                                    See Result Details
                                                </MuiLink>
                                            </Link>
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
                        {paginationRecordCount(pageIndex, results?.count)}
                    </Box>
                    <Pagination count={results?.count ? Math.ceil(results?.count/PAGINATION_COUNT) : 0}
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

export default ResultList
