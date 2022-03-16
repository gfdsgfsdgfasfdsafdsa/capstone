import {
    Box, Card, CardContent,
    List, ListItem, ListItemText, Typography,
    Divider, Table, TableHead, TableRow, TableBody, TableCell,
    TableContainer, AccordionSummary, Accordion, AccordionDetails,
} from "@mui/material";
import {DateTime} from "luxon";
import {useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Result({ result }){
    const [expanded, setExpanded] = useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <>
            <Typography variant="h4" mt={3} mb={1}>
                {result?.student.name}
            </Typography>
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
                                        variant="subtitle2">
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
                        >
                            <div dangerouslySetInnerHTML={{ __html: result?.formula }}/>
                        </Typography>
                    </Box>
                    <Typography
                        mt={1}
                        sx={{
                            fontSize: '15px'
                        }}
                    >
                        {result?.regression_model}
                    </Typography>
                </Box>
            </Box>
        </>
    )
}