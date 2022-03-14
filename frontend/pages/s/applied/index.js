import {DashboardLayout} from "../../../components/DashboardLayout";
import Head from "next/head";
import {Box, Container} from "@mui/material";
import StudentList from "../../../components/schooladmin/studentapplied/StudentList";
import axios from 'axios'
import {useEffect, useState} from "react";
import SearchBar from "../../../components/SearchBar";
import useSWR, { useSWRConfig } from 'swr'
import NextNProgress from "nextjs-progressbar";
import {useRouter} from "next/router";
import appliedStatus from "../../../libs/appliedStatus";

export default function Applied({ studentAppliedList }){
    const router = useRouter()
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')
    const [checked, setChecked] = useState([])
    const [status, setStatus] = useState('Pending')
    const { mutate } = useSWRConfig()
    const { data: studentList, isValidating } = useSWR(`school/exam/students/applied/?page=${pageIndex}&search=${searchText}&status=${status}`
        ,{ fallbackData: studentAppliedList, revalidateOnFocus: false }
    );

    useEffect(() => {
        if(router.query?.name !== undefined && router.query?.status !== undefined){
            if(appliedStatus[router.query?.status] !== undefined){
                setStatus(router.query?.status)
                setSearchText(router.query?.name)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])

    const onKeyUpSearch = (e) => {
        if(e.code === 'Enter')
            setSearchText(e.target.value)
    }

    const onChangeSearch = (e) => {
        if(e.target.value === ''){
            setSearchText('')
        }
    }

    function push(){
        router.push('/s/applied')
    }


    return(
        <>
            <NextNProgress height={3}/>
            <DashboardLayout title="Student Applied">
                <Head>
                    <title>
                        Student Applied
                    </title>
                </Head>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <Container maxWidth={false}>
                        <Box sx={{ mt: 1 }}>
                            <SearchBar
                                onChange={onChangeSearch}
                                onKeyUp={onKeyUpSearch}
                                text={searchText}
                                setText={setSearchText}
                                hasQuery={router?.query?.name}
                                push={push}
                            />
                            <Box sx={{ mt: 1 }}>
                                <StudentList
                                    studentsList={studentList}
                                    checked={checked}
                                    setChecked={setChecked}
                                    mutate={mutate}
                                    status={status}
                                    setStatus={setStatus}
                                    pageIndex={pageIndex}
                                    setPageIndex={setPageIndex}
                                    isValidating={isValidating}
                                />
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </DashboardLayout>
        </>
    )
}

export async function getServerSideProps({ req }) {
    let studentAppliedList = []
    try {
        const { data } = await axios.get(`${process.env.api}/school/exam/students/applied/?page=1&status=Pending` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        studentAppliedList = data
    } catch (_e){
        studentAppliedList = []
    }
    return {
        props: {
            studentAppliedList
        }
    }
}
