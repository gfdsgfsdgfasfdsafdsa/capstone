import Head from 'next/head';
import axios from 'axios'
import useSWR, { useSWRConfig } from 'swr'
import {useState} from "react";
import NextNProgress from "nextjs-progressbar";
import {DashboardLayout} from "../../components/DashboardLayout";
import {Box, Container} from "@mui/material";
import SearchBar from "../../components/SearchBar";
import StudentList from "../../components/admin/students/StudentList";

export default function Students({ studentList }){
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')
    const [activated, setActivated] = useState('yes')
    const [checked, setChecked] = useState([])

    const { data: students, isValidating } = useSWR(`myadmin/students/?page=${pageIndex}&search=${searchText}&activated=${activated}`, {
        fallbackData: studentList,
        revalidateOnFocus: false,
    });
    const { mutate } = useSWRConfig()

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
                    Students
                </title>
            </Head>
            <DashboardLayout title="Students">
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
                            <StudentList
                                mutate={mutate}
                                studentsList={students}
                                isValidating={isValidating}
                                setPageIndex={setPageIndex}
                                pageIndex={pageIndex}
                                activated={activated}
                                setActivated={setActivated}
                                checked={checked}
                                setChecked={setChecked}
                            />
                        </Box>
                    </Container>
                </Box>
            </DashboardLayout>
        </>
    )
}

export async function getServerSideProps({ req }) {
    let studentList = []
    try {
        const { data } = await axios.get(`${process.env.api}/myadmin/students/?page=1` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        studentList = data
    } catch (_e){
        studentList = []
    }
    return {
        props: {
            studentList
        }
    }
}
