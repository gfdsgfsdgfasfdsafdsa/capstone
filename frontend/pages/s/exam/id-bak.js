import { DashboardLayout, Loading } from '../../../components/Index';
import Head from 'next/head';
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Button,
} from '@mui/material';
//import { QuestionHeader, NewQuestionUI, ListUpdateQuestion } from '../../../components/schooladmin/exam/Index';
import QuestionHeader from '../../../components/schooladmin/exam/QuestionHeader';
import NewQuestionUI from '../../../components/schooladmin/exam/NewQuestionUI';
import ListUpdateQuestion from '../../../components/schooladmin/exam/ListUpdateQuestion';
import {
    Create as CreateIcon
} from '@mui/icons-material'
import { useState } from 'react';
import { useRouter } from 'next/router'
import useSWR, {useSWRConfig} from "swr";
import {useSnackbar} from "notistack";
import NextNProgress from "nextjs-progressbar";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Exam() {
    const [newQuestion, setNewQuestion] = useState(false)
    const router = useRouter()
    const { id } = router.query
    const { mutate } = useSWRConfig()
    const { data: subjectQuestions, isValidating } = useSWR(id ? `school/exam/subject/${id}/questions/` : [], {
        revalidateOnFocus: false,
    })

    const [status, setStatus] = useState({
        error: false,
        success: true,
        loading: false,
        infoMessage: '',
    })

    const [tabValue, setTabValue] = useState(0);

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (_e, newValue) => {
        setStatus({
            error: false,
            success: true,
            loading: false,
            infoMessage: '',
        })
        setTabValue(newValue);
    };

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination | Subject
                </title>
            </Head>
            <DashboardLayout title={subjectQuestions?.subject_questions.subject ?
                subjectQuestions?.subject_questions.subject : '...'}>
                {!subjectQuestions ? (<Loading/>) : (
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <Container maxWidth="md">
                            <QuestionHeader questionCount={subjectQuestions?.subject_questions?.questions?.length}
                                            status={status}
                            />
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'none',
                                                fontWeight: '500',
                                                padding: '12px 0px',
                                                minWidth: 'unset',
                                            }}
                                            label="List / Update" {...a11yProps(0)} />
                                        <Tab
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'none',
                                                fontWeight: '500',
                                                padding: '12px 0px',
                                                minWidth: 'unset',
                                                marginLeft: '24px',
                                            }}
                                            label="New Question" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={tabValue} index={0}>
                                    <ListUpdateQuestion
                                        subjectQuestions={subjectQuestions.subject_questions.questions}
                                        enqueueSnackbar={enqueueSnackbar}
                                        subjectId={id}
                                        mutate={mutate}
                                    />
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    {newQuestion ? (
                                        <NewQuestionUI
                                            mutate={mutate}
                                            routerId={id}
                                            enqueueSnackbar={enqueueSnackbar}
                                            setNewQuestion={setNewQuestion}
                                            status={status}
                                            setStatus={setStatus}
                                        />
                                    ) : (
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={(_e) => setNewQuestion(true)}
                                                endIcon={<CreateIcon />}
                                                size="small"
                                            >
                                                New Question
                                            </Button>
                                        </Box>
                                    )}
                                </TabPanel>
                            </Box>
                        </Container>
                    </Box>
                )}
            </DashboardLayout>
        </>
    )
}
/*
export async function getStaticPaths() {
    let paths = []
    try{
        await axios.get('/api/get-cookies').then((res) => {
            console.log(res)
        })
        const { data } = await axios.get('/api/subject-questions')
        console.log()
        paths = data?.exam_subjects.map((d) => ({
            params: { id: d.id },
        }))
    }catch (error){
    }
    return { paths, fallback: true }
}
export async function getStaticProps({ params, req }) {
    let subjectQuestions = []
    try {
        const { data } = await axios.get(`school/exam/subject/${params.id}/questions/`, {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        subjectQuestions = data
    } catch (error){
        subjectQuestions = []
    }
    return {
        props: {
            t: subjectQuestions
        }
    }
}
 */
