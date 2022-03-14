import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import {useRouter} from "next/router";
import useSWR from "swr";
import Single from "../../../components/student/pages/result/Single";
import Loading from "../../../components/Loading";
import NextNProgress from "nextjs-progressbar";

const ResultId = () => {
    const router = useRouter()
    const { id } = router.query
    const { data: result, error } = useSWR(id ? `student/exam/result/${id}/` : [], {
        revalidateOnFocus: false,
    })

    if(error?.response?.status === 405)
        router.push(`/u/exam/details/${id}`)

    if(result && !result?.submitted){
        if(router.isReady)
            router.push(`/u/exam/details/${id}`)

        return(
            <DashboardLayout title="Result">
                <Loading/>
            </DashboardLayout>
        )
    }

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Result
                </title>
            </Head>
            <DashboardLayout title="Result">
                {result ?
                    <Single result={result}/> :
                    <Loading/>
                }
            </DashboardLayout>
        </>
    )
}

export default ResultId;
