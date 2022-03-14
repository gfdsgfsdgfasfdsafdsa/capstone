import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Card, Paper, Pagination, Checkbox, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Check as CheckIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
} from "@mui/icons-material";
import {useState} from "react";
import AppliedStatus from "../../AppliedStatus";
import AxiosInstance from "../../../utils/axiosInstance";
import { PAGINATION_COUNT, paginationRecordCount } from "../../../config/settings";

function Row(props) {
    const { row, bg, onChecked, checked, status } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: bg }}>
                {status !== 'Accepted' && (
                    <TableCell>
                        <Checkbox
                            size="small"
                            color="primary"
                            checked={checked.includes(row.student.id)}
                            onClick={() => onChecked(row.student.id)}
                        />
                    </TableCell>
                )}
                <TableCell component="th" scope="row">
                    {row.student.name}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.student.strand}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.student.school}
                </TableCell>
                <TableCell component="th" align="center" scope="row">
                    <AppliedStatus status={row.status}/>
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, marginTop: 0 }}>
                            <Typography variant="overline" gutterBottom component="div">
                                Details of {row.student.name}
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Age</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.student.id}>
                                        <TableCell component="th" scope="row">
                                            {row.student.email}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.student.gender}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.student.age}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function StudentList({ studentsList, checked, setChecked, mutate,
    status, setStatus, pageIndex, setPageIndex, isValidating,
}) {

    async function checkBoxSelected(id){
        let c = [...checked]
        if(c.includes(id)){
            const index = c.indexOf(id);
            if (index > -1) {
                c.splice(index, 1); // 2nd parameter means remove one item only
            }
        }else{
            c.push(id)
        }
        setChecked(c)
    }

    function onClickCancel() {
        setChecked([])
    }

    async function onClickAccept() {
        let bak = [...checked]
        setChecked([])
        await AxiosInstance.put(`school/exam/students/applied/`, {
            student_ids: checked,
            accept: 1,
        })
            .then((_r) => {
                mutate('school/exam/students/applied/?page=1&search=&status=Pending')
                setPageIndex(1)
            }).catch((_e) => {
                setChecked(bak)
        })
    }

    async function onClickReject() {
        let bak = [...checked]
        setChecked([])
        await AxiosInstance.put(`school/exam/students/applied/`, {
            student_ids: checked,
            reject: 1,
        })
            .then((_r) => {
                mutate('school/exam/students/applied/?page=1&search=&status=Pending')
                setPageIndex(1)
            }).catch((_e) => {
                setChecked(bak)
            })
    }

    async function onClickPending() {
        let bak = [...checked]
        setChecked([])
        await AxiosInstance.put(`school/exam/students/applied/`, {
            student_ids: checked,
            pending: 1,
        })
            .then((_r) => {
                mutate(`school/exam/students/applied/?page=1&search=&status=${status}`)
                setPageIndex(1)
            }).catch((_e) => {
                setChecked(bak)
            })
    }

    return (
        <Card>
            <Box>
                <Paper style={{ overflowX: 'auto' }}>
                    <Box sx={{ padding: '20px' }}>
                        {checked?.length >= 1 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center',
                                justifyContent: {
                                    sm: 'space-between',
                                    xs: 'none'
                                },
                                flexDirection: {
                                    sm: 'row',
                                    xs: 'column',
                                },
                                rowGap: 2,
                            }}>
                                <Typography variant="body1" component="div">
                                    {checked.length} Selected
                                    {status === 'Pending' && (
                                        <Typography variant="caption" color="error" component="div">
                                            Warning cannot undo after accepting.
                                        </Typography>
                                    )}
                                </Typography>
                                <Box sx={{ display: 'flex', rowGap: 1 }}>
                                    <Button variant="outlined" size="small" color="error"
                                            endIcon={<CancelIcon />}
                                            onClick={onClickCancel}
                                    >
                                        Cancel
                                    </Button>
                                    {status === 'Pending' ? (
                                        <>
                                            <Button sx={{ ml: 1 }} variant="outlined" size="small" color="error"
                                                    endIcon={<CancelIcon />}
                                                    onClick={onClickReject}
                                            >
                                                Reject
                                            </Button>
                                            <Button sx={{ ml: 1 }} variant="outlined" size="small"
                                                    endIcon={<CheckIcon />}
                                                    onClick={onClickAccept}
                                            >
                                                Accept
                                            </Button>
                                        </>
                                    ): (
                                        <>
                                            <Button sx={{ ml: 1 }} variant="outlined" size="small" color="warning"
                                                    endIcon={<PendingIcon />}
                                                    onClick={onClickPending}
                                            >
                                                Make Pending
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        ):(
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="overline" p={3}>
                                    {isValidating ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress size={25} sx={{ mr: 1 }}/>&nbsp; Fetching Data..
                                        </Box>
                                    ): 'Check to show actions'}
                                </Typography>
                                <Box>
                                    <FormControl sx={{ ml: 1, mr: 3 }}>
                                        <InputLabel>Select Status</InputLabel>
                                        <Select
                                            value={status}
                                            size="small"
                                            onChange={(e) => setStatus(e.target.value)}
                                            sx={{ width: '150px' }}
                                            label="Select Status"
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Accepted">Accepted</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    {status !== 'Accepted' && (
                                        <TableCell width={10}/>
                                    )}
                                    <TableCell>Student Name</TableCell>
                                    <TableCell>Strand</TableCell>
                                    <TableCell>School</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="right" width={10} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentsList?.count === 0 && (
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <Typography variant="body1" textAlign="center">
                                                No data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {studentsList?.results?.map((row, i) => (
                                    <Row
                                        status={status}
                                        key={row.student.id}
                                        row={row}
                                        bg={i % 2 ? '#f6f6f6' : '#fff'}
                                        onChecked={checkBoxSelected}
                                        checked={checked}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                    {paginationRecordCount(pageIndex, studentsList?.count)}
                </Box>
                <Pagination count={studentsList?.count ? Math.ceil(studentsList?.count/PAGINATION_COUNT) : 0}
                            page={pageIndex}
                            color="primary"
                            onChange={(_e, n) => {
                                setPageIndex(n)
                            }}/>
            </Box>
        </Card>
    );
}
