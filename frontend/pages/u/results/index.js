import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import axios from 'axios'
import useSWR from "swr";
import {useState} from "react";
import Home from "../../../components/student/pages/result/Home";
import NextNProgress from "nextjs-progressbar";

const Results = ({ resultList }) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')

    const { data: results } = useSWR(`student/exam/results/?page=${pageIndex}&search=${searchText}`, {
        fallbackData: resultList
    });

    const onKeyUpSearch = (e) => {
        if(e.code === 'Enter')
            setSearchText(e.target.value)
    }

    const onChangeSearch = (e) => {
        if(e.target.value === ''){
            setSearchText('')
        }
    }

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Results
                </title>
            </Head>
            <Home
                results={results}
                onKeyUpSearch={onKeyUpSearch}
                onChangeSearch={onChangeSearch}
                searchText={searchText}
                setSearchText={setSearchText}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
            />
        </>
    )
}
Results.getLayout = (page) => (
    <DashboardLayout title="Examination">
        {page}
    </DashboardLayout>
);

export default Results;

export async function getServerSideProps({ req }) {
    let resultList = []
    try {
        const { data } = await axios.get(`${process.env.api}/student/exam/results/?page=1` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        resultList = data
    } catch (_e){
        resultList = []
    }
    return {
        props: {
            resultList: resultList
        }
    }
}
