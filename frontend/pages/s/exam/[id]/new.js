import {DashboardLayout} from "../../../../components/DashboardLayout";
import { useRouter } from 'next/router'
import useSWR, {useSWRConfig} from "swr";
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';
import QuestionHeader from "../../../../components/schooladmin/exam/QuestionHeader";
import {useState} from "react";
import {Container} from "@mui/material";
import NewQuestionUI from "../../../../components/schooladmin/exam/NewQuestionUI";

function CreateQuestion(){
    const router = useRouter()
    const { id } = router.query
    const { mutate } = useSWRConfig()
    const { data: subjectQuestions, error, isValidating } = useSWR(id ? `school/exam/subject/${id}/questions/` : [], {
        revalidateOnFocus: false,
    })

    if(error?.response?.status === 404)
        console.log('404')
        //router.push(`/u/exam/details/${id}`)

    const [status, setStatus] = useState({
        error: false,
        success: true,
        loading: false,
        infoMessage: '',
    })

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination | New Question
                </title>
            </Head>
            <DashboardLayout title={subjectQuestions?.subject_questions?.subject ? subjectQuestions?.subject_questions?.subject : '...'}>
                <Container maxWidth="md">
                    <QuestionHeader questionCount={subjectQuestions?.subject_questions?.questions?.length}
                                    totalQuestion={subjectQuestions?.subject_questions?.total_question}
                                    status={status}
                                    id={id}
                                    update={false}
                    />
                    <NewQuestionUI
                        questionCount={subjectQuestions?.subject_questions?.questions?.length}
                        totalQuestion={subjectQuestions?.subject_questions?.total_question}
                        mutate={mutate}
                        routerId={id}
                        setStatus={setStatus}
                    />
                </Container>
            </DashboardLayout>
        </>
    )
}

export default CreateQuestion;
