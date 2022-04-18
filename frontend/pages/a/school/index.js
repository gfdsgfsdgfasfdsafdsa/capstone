import Head from 'next/head';
import { DashboardLayout } from '../../../components/DashboardLayout';
import axios from 'axios'
import { useState} from "react";
import SearchBar from "../../../components/SearchBar";
import SchoolList from "../../../components/admin/school/SchoolList";
import {Box, Container, } from "@mui/material";
import NextNProgress from "nextjs-progressbar";
import useSWR, {useSWRConfig} from "swr";

export default function School({ schoolsList }){
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')
    const { data: schools, isValidating, mutate } = useSWR(`myadmin/schools/?page=${pageIndex}&search=${searchText}`, {
        fallbackData: schoolsList,
        revalidateOnFocus: false,
    });

    // const { mutate } = useSWRConfig()


    const onKeyUpSearch = (e) => {
        if(e.code === 'Enter')
            setSearchText(e.target.value)
    }

    const onChangeSearch = (e) => {
        if(e.target.value === ''){
            setSearchText('')
        }
    }

    return(
        <DashboardLayout title='Schools'>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    School Lists
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
                    />
                    <Box sx={{ mt: 1 }}>
                        <SchoolList
                            isValidating={isValidating}
                            mutate={mutate}
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            schools={schools}/>
                    </Box>
                </Container>
            </Box>
        </DashboardLayout>
    )
}

export async function getServerSideProps({ req }) {
    let schoolsList = []
    try {
        const { data } = await axios.get(`${process.env.api}/myadmin/schools/?page=1` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        schoolsList = data
    } catch (_e){
        schoolsList = []
    }
    return {
        props: {
            schoolsList
        }
    }
}
