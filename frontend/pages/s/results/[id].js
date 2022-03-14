import {DashboardLayout} from "../../../components/DashboardLayout";
import {
    Container,
} from "@mui/material";
import useSWR from "swr";
import Result from "../../../components/schooladmin/result/Result";
import Loading from "../../../components/Loading";
import { useRouter } from 'next/router'
import NextNProgress from "nextjs-progressbar";

export default function ResultId(){
    const router = useRouter()
    const { id } = router.query
    const { data: result, error } = useSWR(id ? `school/exam/student/results/${id}/` : '')

    if(error?.response?.status === 404)
        router.push('/404')

    return (
        <>
            <NextNProgress height={3}/>
            <DashboardLayout title="Result">
                <Container maxWidth="md">
                    {!result ? <Loading/> : (
                        <Result result={result}/>
                    )}
                </Container>
            </DashboardLayout>
        </>
    )
}