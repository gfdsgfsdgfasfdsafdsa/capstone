import {DashboardLayout} from "../../../../components/DashboardLayout";
import { useRouter } from 'next/router'
import useSWR, {useSWRConfig} from "swr";
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';
import {useState} from "react";
import {
    CircularProgress,
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Checkbox,
} from "@mui/material";
import ViewQuestion from "../../../../components/schooladmin/exam/ViewQuestion";

function ListQuestion(){
    const router = useRouter()
    const { id } = router.query
    const { data: subjectQuestions, error } = useSWR(id ? `school/exam/subject/${id}/questions/` : [], {
        revalidateOnFocus: false,
    })

    if(error?.response?.status === 404)
        console.log('404')
    //router.push(`/u/exam/details/${id}`)

    const [hideChoices, setHideChoices] = useState(false)

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination | List
                </title>
            </Head>
            <DashboardLayout title={subjectQuestions?.subject_questions?.subject ? subjectQuestions?.subject_questions?.subject : '...'}>
                <Container maxWidth="md">
                    <Card sx={{
                        position: 'sticky',
                        top: '60px',
                        zIndex: 100,
                    }}>
                        <CardContent sx={{
                            paddingTop: 2,
                            "&:last-child": {
                                paddingBottom: 2
                            },
                        }}>
                            <Box sx={{ display: 'flex', alignItems:'center', flexWrap: 'wrap'  }}>
                                <Typography
                                    sx={{ mr: 1, lineHeight: 1.75 }}
                                    variant="body1"
                                >
                                    Total Question: {subjectQuestions?.subject_questions?.total_question}
                                </Typography>
                                <Box>
                                    <Typography component="div" variant="subtitle1"
                                                sx={{ display: 'flex', alignItems:'center', fontSize: '.9rem' }}>
                                        <Checkbox size="small"
                                                  onClick={() => setHideChoices(!hideChoices)}
                                        /> Hide Choices
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    {!subjectQuestions ? (
                        <Typography variant="cool" sx={{ ml: 5, display: 'flex', alignItems: 'center', mt: 2 }}>
                            <CircularProgress size={20}/>
                            &nbsp; Fetching data..
                        </Typography>
                    ):(
                        <ViewQuestion
                            questions={subjectQuestions?.subject_questions?.questions}
                            hideChoices={hideChoices}
                        />
                    )}
                </Container>
            </DashboardLayout>
        </>
    )
}

export default ListQuestion;
