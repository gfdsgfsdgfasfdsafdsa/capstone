import { DashboardLayout } from '../../../components/DashboardLayout';
import Head from 'next/head';
import {
    Box, CircularProgress,
    Container,
    Grid, Typography,
} from '@mui/material';
import useSWR from "swr";
import axios from 'axios'
import {useState} from "react";
import NextNProgress from "nextjs-progressbar";
import ExamHeader from "../../../components/schooladmin/exam/ExamHeader";
import SubjectCard from "../../../components/schooladmin/exam/SubjectCard";

export default function Exam({ exam }) {
    const [dScrollOpen, setDScrollOpen] = useState(false);
    const [page, setPage] = useState(1)

    const { data: csvData } = useSWR(dScrollOpen ? `school/csv/${page}/`: null)
    const { data: exam_details, isValidating } = useSWR('school/exam/', {
        fallbackData: exam,
        revalidateOnFocus: false,
    })

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                }}
            >
                <Container maxWidth={false}>
                    <ExamHeader exam={exam_details}
                                dScrollOpen={dScrollOpen}
                                setDScrollOpen={setDScrollOpen}
                                csvData={csvData}
                                setPage={setPage}
                                page={page}
                    />
                    <Box sx={{ pt: 3 }}>
                        {isValidating ? (
                            <Typography component="div" variant="cool" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 2, ml:3 }}/>
                                Fetching Data..
                            </Typography>
                        ): (
                            <Grid
                                container
                                spacing={3}>
                                {exam_details?.exam_subjects?.map((subject) => (
                                    <Grid
                                        item
                                        key={subject.id}
                                        lg={4}
                                        md={6}
                                        xs={12}
                                    >
                                        <SubjectCard published={exam_details.is_published} subject={subject} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 3
                        }}
                    >
                    </Box>
                </Container>
            </Box>
        </>
    )
}

Exam.getLayout = (page) => (
    <DashboardLayout title="Examination">
        {page}
    </DashboardLayout>
);

export async function getServerSideProps({ req }) {
    let exam = []
    try {
        const { data } = await axios.get(`${process.env.api}/school/exam/` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        exam = data
    } catch (error){
        exam = []
    }
    return {
        props: {
            exam
        }
    }
}
