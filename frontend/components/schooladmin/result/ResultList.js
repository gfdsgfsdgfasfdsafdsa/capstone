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
} from '@mui/material';
import Link from 'next/link'
import { DateTime } from 'luxon'
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";


export default function ResultList({ pageIndex, setPageIndex, students }){

    return (
        <>
            <Card>
                <Box>
                    <Paper style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ minWidth: '300px' }}>
                                        Name
                                    </TableCell>
                                    <TableCell style={{ minWidth: '200px' }}>
                                        Date Taken
                                    </TableCell>
                                    <TableCell style={{ minWidth: '300px' }}>
                                        School
                                    </TableCell>
                                    <TableCell style={{ minWidth: '190px' }}>
                                        Strand
                                    </TableCell>
                                    <TableCell style={{ minWidth: '150px' }}>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students?.count === 0 && (
                                    <TableRow>
                                        <TableCell colSpan="5">
                                            <Typography variant="body1" textAlign="center">
                                                No data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {students?.results?.map((student) => (
                                    <TableRow
                                        hover
                                        key={student.id}
                                    >
                                        <TableCell>
                                            {student.student.name}
                                        </TableCell>
                                        <TableCell>
                                            {DateTime.fromISO(student.date_taken).toFormat('LLL. dd yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {student.student.school}
                                        </TableCell>
                                        <TableCell>
                                            {student.student.strand}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/s/results/${student?.id}`} passHref>
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
                        {paginationRecordCount(pageIndex, students?.count)}
                    </Box>
                    <Pagination count={students?.count ? Math.ceil(students?.count/PAGINATION_COUNT) : 0}
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
