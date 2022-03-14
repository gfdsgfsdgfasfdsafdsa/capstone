import Head from 'next/head';
import {
    Box,
    Card,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import axios from 'axios'
import useSWR from "swr";
import {useEffect, useState} from "react";
import NextNProgress from "nextjs-progressbar";
import {useRouter} from "next/router";
import { DashboardLayout } from '../../../components/DashboardLayout';
import appliedStatus from "../../../libs/appliedStatus";
import SchoolList from '../../../components/student/exam/SchoolList';
import SearchBar from "../../../components/SearchBar";


const Exam = ({ schoolsList }) => {
    const router = useRouter()
    const [pageIndex, setPageIndex] = useState(1);
    const [searchText, setSearchText] = useState('')
    const [status, setStatus] = useState('None')
    const { data: schools, isValidating } = useSWR(`student/schools/?page=${pageIndex}&search=${searchText}&status=${status}`, {
        fallbackData: schoolsList,
        revalidateOnFocus: false,
    });

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
        router.push('/u/exam/')
    }

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Examination
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
                        hasQuery={router?.query?.name}
                        push={push}
                    />
                    <Box sx={{ mt: 1 }}>
                        <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="overline" p={3} fontWeight={500}>
                                    {isValidating ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress size={20}/>&nbsp;&nbsp; Getting data..
                                        </Box>
                                    ):'Apply for examination to take exam'}
                                </Typography>
                                <Box>
                                    <FormControl sx={{ ml: 1, mr: 3 }}>
                                        <InputLabel>Select Status</InputLabel>
                                        <Select
                                            value={status}
                                            size="small"
                                            onChange={(e) => setStatus(e.target.value)}
                                            label="Select Status"
                                            sx={{ width: '150px' }}
                                        >
                                            <MenuItem value="None">None</MenuItem>
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Accepted">Accepted</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <SchoolList
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                status={status}
                                schools={schools}/>

                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    )
}
Exam.getLayout = (page) => (
    <DashboardLayout title="Examination">
        {page}
    </DashboardLayout>
);

export default Exam;

export async function getServerSideProps({ req }) {
    let schoolsList = []
    try {
        const { data } = await axios.get(`${process.env.api}/student/schools/?page=1` , {
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
