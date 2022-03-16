import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import {useRouter} from "next/router";
import useSWR from "swr";
import Single from "../../../components/student/pages/exam/Single";
import Loading from "../../../components/Loading";
import NextNProgress from "nextjs-progressbar";

const ExamId = () => {
    const router = useRouter()
    const { id } = router.query
    const { data: exam, mutate, error } = useSWR(id ? `student/exam/start/${id}/` : [], {
        revalidateOnFocus: false
    })

    if(error?.response?.status === 405)
        router.push(`/u/exam/details/${id}`)

    if(exam?.submitted){
        router.push(`/u/results/${id}`)
        return <Loading/>
    }

    return (
        <>
            <NextNProgress height={3}/>
            <DashboardLayout title="Examination">
                <Head>
                    <title>
                        Examination
                    </title>
                </Head>
                {!exam ? <Loading/>
                    : <Single school={exam} mutate={mutate} router={router} id={id}/>}
            </DashboardLayout>
        </>
    )
}

export default ExamId;
