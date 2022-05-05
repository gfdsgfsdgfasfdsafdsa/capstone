import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import axios from 'axios'
import useSWR from "swr";
import {useEffect, useState} from "react";
import SearchBar from "../../../components/SearchBar";
import ResultList from "../../../components/schooladmin/result/ResultList";
import {Box, Container} from "@mui/material";
import NextNProgress from "nextjs-progressbar";

const Results = ({ resultList }) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')

    const { data: results, mutate } = useSWR(`school/exam/student/results/?page=${pageIndex}&search=${searchText}`, {
        fallbackData: resultList,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultList])

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
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                }}
            >
                <Container maxWidth={false}>
                    <SearchBar
                        onChange={onChangeSearch}
                        onKeyUp={onKeyUpSearch}
                        text={searchText}
                        setText={setSearchText}
                        hasQuery={false}
                    />
                    <Box sx={{ mt: 1 }}>
                        <ResultList
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            students={results}
                        />
                    </Box>
                </Container>
            </Box>
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
        const { data } = await axios.get(`${process.env.api}/school/exam/student/results/?page=1` , {
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
