import {DashboardLayout} from "../../../components/DashboardLayout";
import {
    Container,
} from "@mui/material";
import useSWR from "swr";
import Result from "../../../components/schooladmin/result/Result";
import Loading from "../../../components/Loading";
import { useRouter } from 'next/router'
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';

export default function ResultId(){
    const router = useRouter()
    const { id } = router.query
    const { data: result, error } = useSWR(id ? `school/exam/student/results/${id}/` : '', {
        revalidateOnFocus: false,
    })

    if(error?.response?.status === 404)
        router.push('/404')

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Result
                </title>
            </Head>
            <DashboardLayout title="Result">
                <Container maxWidth="md">
                    {!result ? <Loading/> : (
                        <Result
                            result={result}
                            id={id}
                        />
                    )}
                </Container>
            </DashboardLayout>
        </>
    )
}