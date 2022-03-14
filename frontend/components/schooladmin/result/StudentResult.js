import {
    Box,
    Typography,
} from '@mui/material';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { blue } from '@mui/material/colors'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';

const rows = [
    createData('Math', '62'),
    createData('English', '62'),
    createData('Science', '62'),
    createData('Emotional Intelligence', '62'),
    createData('Intelligent Qoutient', '62'),
    createData('Math', '62'),
]

function createData(subject, score) {
    return { subject, score };
  }

const courses = [
    courseData('1.','Bachelor of Management Science'),
    courseData('2.','Bachelor of Travel and Tourism Management'),
    courseData('3.','Bachelor of Social Work'),
    courseData('4.','Bachelor of Information Technology'),
    courseData('5.','Bachelor of Pharmacy'),
]

function courseData(rank, rcourse) {
    return { rank, rcourse };
  }



const StudentResult = () => {

    return (
        <Box>
            <Box
                sx={{
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    m: -1,
                    p: 2,
                }}
            >
                <Typography variant="text">
                    Name: test 
                </Typography>
                <Typography variant="text">
                    Age: 69
                </Typography>
                <Typography variant="text">
                    Gender: Shemale 
                </Typography>
                <Typography variant="text">
                    School: skwelahan 
                </Typography>
                <Typography variant="text">
                    Strand: sa buhok 
                </Typography>
                
            </Box>

            <Box sx={{boxShadow: 3, borderBottom: 1, borderRadius: 1, mt:1, borderColor: 'gray'}}>
                <Box
                    sx={{
                        p: 2,
                        bgcolor: blue[700],
                        width: '100%',
                        borderRadius: 1,
                    }}
                >
                    <Typography sx={{pr:3, color: 'white'}} variant="text">
                        Examination
                    </Typography>
                </Box>

                <TableContainer>
                    <Table sx={{ maxWidth: '20%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell align='right'>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                        <TableRow key={row.subject}>
                            <TableCell>{row.subject}</TableCell>
                            <TableCell align='right'>{row.score}</TableCell>
                        </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{boxShadow: 3, borderBottom: 1, borderRadius: 1, mt:1, borderColor: 'gray'}}>
                <Box
                    sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: blue[700],
                        width: '100%',
                        borderRadius: 1,
                        color: 'white',
                    }}
                >
                    Course Recommended
                </Box>

                <Box sx={{pl: 2}}>
                
                </Box>

                <TableContainer>
                    <Table sx={{ maxWidth: '30%' }} >
                        <TableBody>
                        {courses.map((course) => (
                        <TableRow key={course.rank}>
                            <TableCell>{course.rank}</TableCell>
                            <TableCell>{course.rcourse}</TableCell>
                        </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{boxShadow: 3, borderBottom: 1, borderRadius: 1, mt:1, borderColor: 'gray'}}>

                <Box
                    sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: blue[700],
                        width: '100%',
                        borderRadius: 1,
                        color: 'white',
                    }}
                >
                    Regression Details
                </Box>
                <Box>
                    View Details 
                    <ArrowDropDownIcon size='small'/>
                </Box>

            </Box>
        </Box>



    )
}

export default StudentResult
