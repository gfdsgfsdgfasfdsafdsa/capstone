import {
    Box,
    Container, Divider,
    Grid,
    Typography,
    Card,
    CardContent,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, AccordionDetails, AccordionSummary, Accordion
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import Image from 'next/image'

export default function Single({ result }){
    const [expanded, setExpanded] = useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <>
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between' ,
                        flexWrap: 'wrap',
                        px: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'start',
                            my: 2,
                            justifyContent: 'start',
                        }}
                    >
                        <Image
                            src={result?.logo_url ? result?.logo_url: "/static/images/default.png"}
                            alt="Picture of the author"
                            width={80}
                            height={80}
                            quality={100}
                            placeholder="blur"
                            blurDataURL={result?.logo_url ? result?.logo_url: "/static/images/hcdc_logo.png"}
                        />
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="h5">
                                {result.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1}}
                            >
                                {result.description}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider/>
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
                                    {result.result_details.map((r, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                {r.subject}
                                            </TableCell>
                                            <TableCell>
                                                {r.score} / {r.total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                <Box mt={3} pb={10}>
                    <>
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Course Recommended
                            </Typography>
                        </Box>
                        {result?.course_recommended.map((d, i) => (
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
                </Box>
            </Container>
        </>
    )
}
