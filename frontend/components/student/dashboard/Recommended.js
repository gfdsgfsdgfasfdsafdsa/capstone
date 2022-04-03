import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useState} from "react";
import {Card, CardContent, CardHeader} from "@mui/material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="cool" gutterBottom component="div">
                  Course Recommended
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Course</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.course_list.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.rank}
                          </TableCell>
                          <TableCell>{row.course}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
  );
}

export default function Recommended({ data }) {
  return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
            title="Recent Exams"
            sx={{ paddingBottom: '5px' }}
        />
        <CardContent sx={{ paddingTop: 0 }}>
          <Typography variant="caption">
            Click To View
          </Typography>
          <TableContainer>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>School</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan="3">
                        <Typography variant="body1" textAlign="center">
                          No data
                        </Typography>
                      </TableCell>
                    </TableRow>
                )}
                {data?.map((row) => (
                    <Row key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
  );
}
