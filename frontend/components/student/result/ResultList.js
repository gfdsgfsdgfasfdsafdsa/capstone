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
    Stack, TextField, Button,
} from '@mui/material';
import Link from 'next/link'
import Image from 'next/image'
import {DateTime} from "luxon";
import {PAGINATION_COUNT, paginationRecordCount} from "../../../config/settings";
import {useEffect} from "react";

const ResultList = ({ pageIndex, setPageIndex, results,
                        fromDate, setFromDate, toDate, setToDate, filter, setFilter,
                    }) => {

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
                                                    display: 'flex',
                                                    height: 15
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
