import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import {useRouter} from "next/router";
import useSWR from "swr";
import Single from "../../../components/student/pages/exam/Single";
import Loading from "../../../components/Loading";
import NextNProgress from "nextjs-progressbar";
import {useRef} from "react";

const ExamId = () => {
    const router = useRouter()
    const { id } = router.query
    const random = useRef(Date.now())
    const { data: exam, mutate, error } = useSWR(id ? [`student/exam/start/${id}/`, random]: [], {
        revalidateOnFocus: false
    })

    if(error?.response?.status === 405)
        router.push(`/u/exam/details/${id}`)

    if(exam?.submitted){
        router.push(`/u/results/${id}`)
        return (
            <DashboardLayout title="Examination">
                <Loading/>
            </DashboardLayout>
        )
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
