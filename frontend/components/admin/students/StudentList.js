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
    const { row, bg, onChecked, checked } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: bg }}>
                <TableCell>
                    <Checkbox
                        size="small"
                        color="primary"
                        checked={checked.includes(row.user_id)}
                        onClick={() => onChecked(row.user_id)}
                    />
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.email}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.gender}
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
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>School</TableCell>
                                        <TableCell>Strand</TableCell>
                                        <TableCell>Age</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.school}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.strand}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.age}
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

export default function StudentList({ studentsList, activated, setActivated, checked, setChecked,
                                        pageIndex, setPageIndex, isValidating, mutate
                                    }) {

    async function checkBoxSelected(id){
        let c = [...checked]
        if(c.includes(id)){
            const index = c.indexOf(id);
            if (index > -1) {
                c.splice(index, 1);
            }
        }else{
            c.push(id)
        }
        setChecked(c)
    }

    function onClickCancel() {
        setChecked([])
    }

    async function onClickActivate() {
        alert('Server')
        let bak = [...checked]
        setChecked([])
        await AxiosInstance.put(`myadmin/students/`, {
            student_ids: checked,
            activate: 1,
        })
            .then((_r) => {
                mutate('myadmin/students/?page=1&search=&activated=no')
                setPageIndex(1)
            }).catch((_e) => {
                setChecked(bak)
                alert(e)
            })
    }

    async function onClickDeactivate() {
        let bak = [...checked]
        setChecked([])
        await AxiosInstance.put(`myadmin/students/`, {
            student_ids: checked,
            deactivate: 1,
        })
            .then((_r) => {
                mutate('myadmin/students/?page=1&search=&activated=yes')
                setPageIndex(1)
            }).catch((e) => {
                setChecked(bak)
                alert(e)
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
                                </Typography>
                                <Box sx={{ display: 'flex', rowGap: 1 }}>
                                    <Button variant="outlined" size="small" color="error"
                                            onClick={onClickCancel}
                                            endIcon={<CancelIcon />}
                                    >
                                        Cancel
                                    </Button>
                                    {activated === 'yes' ? (
                                        <>
                                            <Button sx={{ ml: 1 }} variant="outlined" size="small" color="error"
                                                    endIcon={<CheckIcon />}
                                                    onClick={onClickDeactivate}
                                            >
                                                Deactivate
                                            </Button>
                                        </>
                                    ): (
                                        <>
                                            <Button sx={{ ml: 1 }} variant="outlined" size="small"
                                                    endIcon={<CheckIcon />}
                                                    onClick={onClickActivate}
                                            >
                                                Activate
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
                                            value={activated}
                                            size="small"
                                            onChange={(e) => setActivated(e.target.value)}
                                            sx={{ width: '150px' }}
                                            label="Select Status"
                                        >
                                            <MenuItem value="yes">Activated</MenuItem>
                                            <MenuItem value="no">Not Activated</MenuItem>
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
                                    <TableCell width={10}/>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Gender</TableCell>
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
                                {studentsList?.results?.map((student, i) => (
                                    <Row
                                        key={student.user_id}
                                        row={student}
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
