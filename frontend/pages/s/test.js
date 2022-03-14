import {DashboardLayout, Loading} from "../../components/Index";
import axios from "axios";
import useSWR from "swr";
import {
    Box, Container, MenuItem, Select, TextField,
    CardContent, Card, TableContainer, TableCell,
    TableBody, TableRow, Table, TableHead, Typography, Button,
    Accordion, AccordionSummary, AccordionDetails, Link as MuiLink
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import AxiosInstance from "../../utils/axiosInstance";
import Link from 'next/link'

export default function Test({ inputLists }){
    const { data: inputs } = useSWR('school/test/', {
        fallbackData: inputLists
    })
    // const [strand, setStrand] = useState(inputs?.strands[0] ? inputs?.strands[0] : '')
    const [strand, setStrand] = useState('ICT')
    const statusInit = {
        loading: false,
        error: '',
        output: false,
    }
    const [status, setStatus] = useState(statusInit)
    const [fields, setFields] = useState({})
    const [expanded, setExpanded] = useState();
    const [result, setResult] = useState([])

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    if(inputs?.status === '204'){
        return (
            <DashboardLayout title="CSV Test">
                <Container maxWidth="md">
                    <Card>
                        <CardContent>
                            <Typography variant="cool">
                                Please upload csv first
                                &nbsp;
                                <Link href="/s/exam" passHref>
                                    <MuiLink>
                                        Click here
                                    </MuiLink>
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </DashboardLayout>
        )
    }

    if(!inputs){
        return <Loading/>
    }

    async function onClickGo(){
        setResult([])
        setStatus({ error: '', loading: true, output: true })
        await AxiosInstance.post(`school/test/`, { strand, fields })
            .then(({ data }) => {
                setStatus({ error: '', loading: false, output: true })
                setResult(data)
            }).catch((_e) => {
                setStatus({ ...status, error: 'Something is wrong.', loading: false })
            })
    }

    function handleFieldOnChange(e) {
        setFields({ ...fields, [e.target.name]: e.target.value })
    }

    return(
        <DashboardLayout title="CSV Test">
            <Container maxWidth="md">
                <Card>
                    <CardContent>
                        <Box pb={2}>
                            <Typography variant="cool">
                                Csv Data
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {inputs.row_header.map((r, i) => {
                                            if(i === 0){
                                                return(
                                                    <TableCell key={i}>
                                                        {r}
                                                    </TableCell>
                                                )
                                            }else{
                                                return(
                                                    <TableCell key={i} align="right">
                                                        {r}
                                                    </TableCell>
                                                )
                                            }
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inputs.data.map((r, i) => {
                                        return(
                                            <TableRow key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                {r.map((item, ii) => {
                                                    if(ii === 0){
                                                        return(
                                                            <TableCell key={ii} component="th" scope="row">
                                                                {item}
                                                            </TableCell>
                                                        )
                                                    }else{
                                                        return(
                                                            <TableCell key={ii} align="right">
                                                                {item}
                                                            </TableCell>
                                                        )
                                                    }
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                <Card sx={{ marginTop: '20px' }}>
                    <CardContent>
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Do a Regression Test
                            </Typography>
                        </Box>
                        <Typography variant="caption">
                            Select Strand
                        </Typography>
                        <Box>
                            <Select color="primary"
                                    sx={{
                                        width: '300px',

                                        height: '43px',
                                    }}
                                    onChange={(e) => setStrand(e.target.value)}
                                    value={strand}>
                                {inputs.strands.map((strand, i) => (
                                    <MenuItem key={i} value={strand}>
                                        {strand}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Typography variant="caption" mt={2}>
                            Enter Score
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 2 }}>
                            {inputs.subjects.map((subject, i) => (
                                <Typography key={i} componet="span" variant="subtitle3" mr={2}
                                            sx={{ display: 'flex', alignItems: 'center'}}
                                >
                                    {subject} :
                                    <TextField
                                        key={i}
                                        type="number"
                                        autoComplete="off"
                                        name={subject}
                                        sx={{
                                            width: '40px', ml: 1,
                                            '& .MuiOutlinedInput-input': {
                                                padding: '6px'
                                            }
                                        }}
                                        onChange={handleFieldOnChange}
                                    />
                                </Typography>
                            ))}
                            <Button component="a"
                                    href="/s/test#results"
                                    variant="contained" sx={{ padding:'4px 20px' }}
                                    disabled={status.loading}
                                    onClick={onClickGo}>Go</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Box mt={3} pb={10} id="results">
                    <Box>
                        <Typography variant="cool" mb={2}>
                            Results
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" mb={2}>
                            Result will appear here.
                        </Typography>
                    </Box>
                    {status.output && (
                        <>
                            {result.map((d, i) => (
                                <Accordion key={i} expanded={expanded === i} onChange={handleChange(i)}
                                           sx={{ marginTop: '16px' }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${i}bh-content`}
                                        id={`panel${i}bh-header`}>
                                        <Typography variant="cool">
                                            {i+1}. {d.course}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box px={5}>
                                            <Typography variant="subtitle2">
                                                R squared :{d.score}
                                            </Typography>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </>
                    )}
                </Box>
            </Container>
        </DashboardLayout>
    )
}

export async function getServerSideProps({ req }) {
    let d = []
    try {
        const { data } = await axios.get(`${process.env.api}/school/test/` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        d = data
    } catch (error){
        d = []
    }
    return {
        props: {
            inputLists: d
        }
    }
}
