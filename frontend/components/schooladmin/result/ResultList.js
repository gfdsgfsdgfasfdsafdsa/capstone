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
    Pagination, TextField, Button, IconButton, CircularProgress,
} from '@mui/material';
import Link from 'next/link'
import { DateTime } from 'luxon'
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";
import {useEffect, useState} from "react";
import {
    FileDownload as FileDownloadIcon
} from '@mui/icons-material'


export default function ResultList({ pageIndex, setPageIndex, students,
    fromDate, setFromDate, toDate, setToDate, filter, setFilter, onClickExportCSV, onClickExportResult, exportResultLoading
                                   }){

    useEffect(() => {
        setFromDate(new Date().toISOString().slice(0, 10))
        setToDate(new Date().toISOString().slice(0, 10))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setFromDateValue = (e) => {
        setFromDate(e.target.value)
        setPageIndex(1)
    }

    const setToDateValue = (e) => {
        setToDate(e.target.value)
        setPageIndex(1)
    }

    const onClickFilter = () => {
        setFilter(!filter)
    }

    return (
        <>
            <Card
                sx={{
                    mt: 1,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'end',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ pb: 1, mt: 1 }}
                    endIcon={<FileDownloadIcon/>}
                    disabled={students?.count === 0 || exportResultLoading}
                    onClick={onClickExportResult}
                >
                    {exportResultLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <CircularProgress sx={{ mr: 1 }} color="primary" size={20}/>
                            Exporting Result..
                        </Box>
                    ): (
                        <div>
                            Export Result
                        </div>
                    )}
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ pb: 1, mt: 1 }}
                    endIcon={<FileDownloadIcon/>}
                    disabled={students?.count === 0}
                    onClick={onClickExportCSV}
                >
                    Export CSV
                </Button>
                <TextField
                    label="From"
                    type="date"
                    size="small"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={fromDate}
                    onChange={setFromDateValue}
                />
                <TextField
                    label="To"
                    type="date"
                    size="small"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={setToDateValue}
                    value={toDate}
                />
                {!filter ? (
                    <Button
                        size="small"
                        variant="contained"
                        sx={{ pb: 1, mt: 1, mr: 2 }}
                        onClick={onClickFilter}
                    >
                        Filter
                    </Button>
                ): (
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ pb: 1, mt: 1, mr: 2 }}
                        onClick={onClickFilter}
                    >
                        Cancel Filter
                    </Button>
                )}
            </Card>
            <Card>
                <Box>
                    <Paper style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ minWidth: '15px' }}>
                                        ID
                                    </TableCell>
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
                                            {student.student.id}
                                        </TableCell>
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
