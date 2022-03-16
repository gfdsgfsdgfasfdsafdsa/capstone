import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import {useRouter} from "next/router";
import useSWR from "swr";
import Single from "../../../components/student/pages/result/Single";
import Loading from "../../../components/Loading";
import NextNProgress from "nextjs-progressbar";
import {useRef} from "react";

const ResultId = () => {
    const router = useRouter()
    const { id } = router.query
    const random = useRef(Date.now())
    const { data: result } = useSWR(id ? [`student/exam/result/${id}/`, random]: [], {
        revalidateOnFocus: false,
    })
    if(!result){
        return(
            <DashboardLayout title="Result">
                <Loading/>
            </DashboardLayout>
        )
    }

    if(!result?.submitted || result?.not_found){
        if(router.isReady){
            router.push(`/u/exam/details/${id}`)
        }

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
