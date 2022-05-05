import {
    Box, Card, CardContent,
    List, ListItem, ListItemText, Typography,
    Divider, Table, TableHead, TableRow, TableBody, TableCell,
    TableContainer, Button,
    Link as MuiLink,
} from "@mui/material";
import {DateTime} from "luxon";
import {useState} from "react";
import CustomDialog from "../../CustomDialog";
import Alert from "../../Alert";
import Link from 'next/link'
import AlertCollapse from "../../AlertCollapse";
import AxiosInstance from "../../../utils/axiosInstance";

export default function Result({ result, id }){

    const [openDialog, setOpenDialog] = useState(false)
    const [deleted, setDeleted] = useState({
        status: false,
        error: false,
    })
    const [loading, setLoading] = useState(false)

    const onClickDeleteResult = async () => {
        setOpenDialog(false)
        setLoading(true)
        setDeleted({ error: false, status: false })
        if(!result?.student?.id){
            setDeleted({ error: true, status: false })
            setLoading(false)
        }else{
            await AxiosInstance.delete(`school/exam/student/results/${id}/`, {
                data: {
                    student_id: result?.student?.id
                }
            })
                .then((_r) => {
                    setDeleted({ error: false, status: true })
                    setLoading(false)
                }).catch((_e) => {
                    setDeleted({ error: true, status: false })
                    setLoading(false)
                })
        }
    }

    return (
        <>
            <CustomDialog
                onClickConfirm={onClickDeleteResult}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                title={'Are you sure you want to delete this result?'}
                content={'By deleting this the, student will be able to apply again and take the exam.'}
            />
            {deleted.status ? (
                <Box
                    mt={3}
                    mb={1}
                >
                    <Alert text="Data has been deleted successfully."
                           condition={true}/>
                    <Box
                        mt={3}
                        ml={3}
                    >
                        <Typography
                            variant="cool"
                        >
                            Go back to &nbsp;
                            <Link href={`/s/results/`} passHref>
                                <MuiLink>
                                    Results
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            ): (
                <>
                    {loading && (
                        <Box
                            mt={1}
                        >
                            <AlertCollapse
                                severity="loading"
                                text={"Deleting data.."}
                                condition={true}
                            />
                        </Box>
                    )}
                    {deleted.error && (
                        <Box
                            mt={1}
                        >
                            <Alert text="Something went wrong please refresh the page."
                                   severity="error"
                                   condition={true}/>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between' ,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                        mt={1} mb={1}
                    >
                        <Typography variant="h4">
                            {result?.student.name}
                        </Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete Result
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" mb={3}>
                        Date taken: &nbsp;
                        {DateTime.fromISO(result?.date_taken).toFormat('LLL dd, yyyy')}
                    </Typography>
                    <Card>
                        <CardContent
                            sx={{
                                padding: 0,
                                '&:last-child': {
                                    paddingBottom: 0,
                                }
                            }}>
                            <Box sx={{ padding: '12px 24px' }}>
                                <Typography variant="cool">
                                    Student Information
                                </Typography>
                            </Box>
                            <Divider/>
                            <List sx={{ padding: 0 }}>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                Strand
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.strand}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2"
                                            >
                                                Age
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.age}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                School from
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.school}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                Gender
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.gender}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card sx={{ marginTop: '20px' }}>
                        <CardContent sx={{ padding: '12px 24px' }}>
                            <Typography variant="cool">
                                Exam Result
                            </Typography>
                            <TableContainer sx={{ marginTop: '10px' }}>
                                <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ maxWidth: 10 }}>
                                                Subject
                                            </TableCell>
                                            <TableCell align="left">
                                                Score
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result?.result_details.map((s, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    {s.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {s.score}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                    <Box mt={3} pb={10} ml={3}>
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Course Recommended
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" mb={2}>
                                Same no. in ranking has no particular order
                            </Typography>
                        </Box>
                        {result?.result_courses.map((d, i) => (
                            <Box key={d.id} sx={{ pl: 5 }}>
                                <Typography variant="cool" mb={2}>
                                    {d.rank} <span style={{ marginLeft: '10px' }}>{d.course}</span>
                                </Typography>
                            </Box>
                        ))}
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Regression model
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 5 }}>
                            <Box mt={1}>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                    }}
                                    component="div"
                                >
                                    <div dangerouslySetInnerHTML={{ __html: result?.formula }}/>
                                </Typography>
                            </Box>
                            <Typography
                                mt={1}
                                sx={{
                                    fontSize: '15px'
                                }}
                                component="div"
                            >
                                <div dangerouslySetInnerHTML={{ __html: result?.regression_model }}/>
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}