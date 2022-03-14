import Head from 'next/head';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import SubjectLists from '../../../../components/student/exam/details/SubjectLists';
import SchoolInfoHeader from '../../../../components/student/exam/SchoolInfoHeader';
import {
    Box, Button,
    Container, CircularProgress, Typography, Select, FormControl, MenuItem
} from '@mui/material'
import useSWR, {useSWRConfig} from "swr";
import {useRouter} from "next/router";
import AxiosInstance from "../../../../utils/axiosInstance";
import {useState} from "react";
import Loading from "../../../../components/Loading";
import {useSnackbar} from "notistack";
import Alert from "../../../../components/Alert";
import NextNProgress from "nextjs-progressbar";
import AlertCollapse from "../../../../components/AlertCollapse";

const ExamDetails = () => {
    const router = useRouter()
    const { mutate } = useSWRConfig()
    const { id } = router.query
    const { data: exam_details, error } = useSWR(id ? `school/schools/${id}/` : [],
        { revalidateOnFocus: false })
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')

    const [dScrollOpen, setDScrollOpen] = useState(false);
    const { data: courses, error: courseError } = useSWR(id && dScrollOpen ? `student/school/courses/${id}/` : [],
        { revalidateOnFocus: false })

    if(error?.response?.status === 404)
        router.push('/404')
    if(exam_details?.taken)
       router.push(`/u/results/${id}`)

    if(!exam_details) return <Loading/>

    const startExam = async () => {
        setLoading(true)
        setLoadingText('Starting Examination..')
        await AxiosInstance.post(`student/exam/start/${id}/`, { 'start': 'yes' })
            .then((_r) => {
                return router.push(`/u/exam/${id}`)
            }).catch((_e) => {
                enqueueSnackbar('Unable to start Exam', { variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                });
                setLoading(false)
        })
    }

    //Just checking if user pressed start
    /**
    const { data: exam, error:exam_error } = useSWR(id ? `student/exam/start/${id}/` : [])
    if(!exam && !exam_error)
        return <FullPageLoad/>
    if(exam)
        router.push(`/u/exam/${id}`)
     **/

    async function handleApply() {
        setLoading(true)
        setLoadingText('Applying...')

        await AxiosInstance.put(`student/schools/`, {
            id,
            apply: 1,
        }).then((_r) => {
            setLoading(false)
            mutate(`school/schools/${id}/`)
        }).catch((_e) => {
            enqueueSnackbar('Failed to Apply', { variant: 'error',
                autoHideDuration: 2500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            setLoading(false)
        })
    }

    async function handleCancelApply(){
        setLoading(true)
        setLoadingText('Canceling..')
        await AxiosInstance.put(`student/schools/`, {
            id: id,
            cancel: 1,
        }).then((_r) => {
            enqueueSnackbar('Canceled', { variant: 'info',
                autoHideDuration: 2500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            setLoading(false)
            mutate(`school/schools/${id}/`)
        }).catch((_e) => {
            enqueueSnackbar('Failed to Cancel', { variant: 'error',
                autoHideDuration: 2500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            setLoading(false)
        })
    }

    function displayBtn(s){
        if(s === null){
            return (
                <Button
                    disabled={loading}
                    onClick={handleApply}
                    variant="contained" size="small" sx={{ mt: 2 }}>
                    Apply for Examination
                </Button>
            )
        }else if(s === 'Pending'){
            return (
                <Button
                    disabled={loading}
                    onClick={handleCancelApply}
                    variant="contained" color="error" size="small" sx={{ mt: 2 }}>
                    Cancel
                </Button>
            )
        }else if (s === 'Accepted'){
            return(
                <Button
                    disabled={loading}
                    onClick={startExam}
                    variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
                    Start Examination
                </Button>
            )
        }
    }

    return (
        <>
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Exam Details
                </title>
            </Head>
            <Container maxWidth="md">
                <Alert text="You have applied for examination to this school. Please wait for their approval."
                       condition={exam_details?.status === 'Pending'}/>
                <Alert text="Your application has been rejected by the school."
                       condition={exam_details?.status === 'Rejected'} severity="error"/>
                {loading ? (
                    <AlertCollapse
                        severity="loading"
                        text={loadingText}
                        condition={true}
                    />
                ): (
                    <Alert text="Your application has been accepted you can now start your examination."
                           condition={exam_details?.status === 'Accepted'}/>
                )}
                <SchoolInfoHeader
                    logoUrl={exam_details?.logo_url}
                    name={exam_details?.name}
                    description={exam_details?.description}
                    dScrollOpen={dScrollOpen}
                    setDScrollOpen={setDScrollOpen}
                    courses={courses}
                />
                {exam_details?.subjects !== undefined && (
                    <SubjectLists subjects={exam_details.subjects} />
                )}
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    {displayBtn(exam_details?.status)}
                </Box>
            </Container>
        </>
    )
}

ExamDetails.getLayout = (page) => (
    <DashboardLayout title="Exam Details" breadcr={[{ name: 'Exam', href: '/u/exam' }, { name: 'Details' }]}>
        {page}
    </DashboardLayout>
);

export default ExamDetails;
