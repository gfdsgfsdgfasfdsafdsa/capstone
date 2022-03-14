import { useRouter } from 'next/router'
import useSWR, {useSWRConfig} from "swr";
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';
import { useState } from "react";
import {
    CircularProgress,
    Container,
    Typography
} from "@mui/material";
import QuestionHeader from "../../../../components/schooladmin/exam/QuestionHeader";
import ListUpdateQuestion from "../../../../components/schooladmin/exam/ListUpdateQuestion";
import {DashboardLayout} from "../../../../components/DashboardLayout";

function ModifyQuestion(){
    const router = useRouter()
    const { id } = router.query
    const { data: subjectQuestions, mutate, error } = useSWR(id ? `school/exam/subject/${id}/questions/` : [], {
        revalidateOnFocus: false,
    })
    const [checked, setChecked] = useState([])

    if(error?.response?.status === 404)
        router.push('/404')

    const [status, setStatus] = useState({
        error: false,
        success: false,
        loading: false,
        infoMessage: '',
    })

    const [hideChoices, setHideChoices] = useState(false)

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination | Update/List Question
                </title>
            </Head>
            <DashboardLayout title={subjectQuestions?.subject_questions?.subject ? subjectQuestions?.subject_questions?.subject : '...'}>
                <Container maxWidth="md" sx={{ mb: 10 }}>
                    <QuestionHeader questionCount={subjectQuestions?.subject_questions?.questions?.length}
                                    totalQuestion={subjectQuestions?.subject_questions?.total_question}
                                    status={status}
                                    id={id}
                                    checked={checked}
                                    setChecked={setChecked}
                                    setStatus={setStatus}
                                    mutate={mutate}
                                    hideChoices={hideChoices}
                                    setHideChoices={setHideChoices}
                                    subjectQuestions={subjectQuestions}
                    />
                    {!subjectQuestions ? (
                        <Typography variant="cool" sx={{ ml: 5, display: 'flex', alignItems: 'center', mt: 2 }}>
                            <CircularProgress size={20}/>
                            &nbsp; Fetching data..
                        </Typography>
                    ):(
                        !subjectQuestions?.subject_questions?.questions?.length ? (
                            <Typography variant="cool" sx={{ ml: 5, mt: 2 }}>
                                No Data
                            </Typography>
                        ): (
                            <ListUpdateQuestion
                                subjectQuestions={subjectQuestions?.subject_questions.questions}
                                subjectId={id}
                                mutate={mutate}
                                setStatus={setStatus}
                                checked={checked}
                                setChecked={setChecked}
                                hideChoices={hideChoices}
                            />
                        )
                    )}
                </Container>
            </DashboardLayout>
        </>
    )
}

export default ModifyQuestion;
