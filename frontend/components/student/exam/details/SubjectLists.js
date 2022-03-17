import {
    Typography,
    Box,
    Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material'
import TableContainer from "@mui/material/TableContainer";

export default function SubjectLists({ subjects }) {
    return (
        <>
            <Box mt={2} px={2}>
                <Typography variant="cool">
                    Exam to be taken :
                </Typography>
                <TableContainer sx={{ marginTop: '10px' }}>
                    <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ maxWidth: 10 }}>
                                    Subject
                                </TableCell>
                                <TableCell align="left">
                                    Total Score
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((s, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {s.name}
                                        </TableCell>
                                        <TableCell>
                                            {s.question_count} / {s.question_count}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
