import Head from 'next/head';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import SubjectLists from '../../../../components/student/exam/details/SubjectLists';
import SchoolInfoHeader from '../../../../components/student/exam/SchoolInfoHeader';
import {
    Box,
    Button,
    Container, Typography,
} from '@mui/material'
import useSWR, {useSWRConfig} from "swr";
import {useRouter} from "next/router";
import AxiosInstance from "../../../../utils/axiosInstance";
import {useState} from "react";
import Loading from "../../../../components/Loading";
import Alert from "../../../../components/Alert";
import NextNProgress from "nextjs-progressbar";
import AlertCollapse from "../../../../components/AlertCollapse";

const ExamDetails = () => {
    const [enableCam, setEnableCam] = useState({
        status: false,
        info: 'Enable Camera',
        loading: false,
    })

    const router = useRouter()
    const { mutate } = useSWRConfig()
    const { id } = router.query
    const { data: exam_details, error } = useSWR(id ? `school/schools/${id}/` : [], {
        revalidateOnFocus: false,
    })

    const [status, setStatus] = useState({
        error: false,
        loading: false,
        message: '',
    })

    const [dScrollOpen, setDScrollOpen] = useState(false);
    const { data: courses, error: courseError } = useSWR(id && dScrollOpen ? `student/school/courses/${id}/` : [],
        { revalidateOnFocus: false })

    if(error?.response?.status === 404){
        router.push('/404')
        return <Loading/>
    }
    if(exam_details?.taken){
        router.push(`/u/results/${id}`)
        return <Loading/>
    }

    if(!exam_details) return <Loading/>


    const startExam = async () => {
        setStatus({ error: false, loading: true, message: 'Starting Examination..' })
        await AxiosInstance.post(`student/exam/start/${id}/`,
            { 'start': enableCam.status ? 'Enabled': 'Disabled' })
            .then((_r) => {
                try{
                    window.stream.getTracks().forEach(track => track.stop())
                    window.stream = null
                }catch{}
                return router.push(`/u/exam/${id}`)
            }).catch((_e) => {
                setStatus({ error: true, loading: false, message: 'Unable to start Exam' })
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

        setStatus({ error: true, loading: true, message: 'Applying...' })

        await AxiosInstance.put(`student/schools/`, {
            id,
            apply: 1,
        }).then((_r) => {
            setStatus({ error: false, loading: false, message: '' })
            mutate(`school/schools/${id}/`)
        }).catch((_e) => {

            setStatus({ error: true, loading: false, message: 'Something went wrong.' })
        })
    }

    async function handleCancelApply(){
        setStatus({ error: false, loading: true, message: 'Canceling..' })

        await AxiosInstance.put(`student/schools/`, {
            id: id,
            cancel: 1,
        }).then((_r) => {
            setStatus({ error: false, loading: false, message: 'Canceled.' })
            mutate(`school/schools/${id}/`)
        }).catch((_e) => {
            setStatus({ error: true, loading: false, message: 'Failed to Cancel.' })
        })
    }

    function displayBtn(s){
        if(s === null){
            return (
                <Button
                    disabled={status.loading}
                    onClick={handleApply}
                    variant="contained" size="small" sx={{ mt: 2 }}>
                    Apply for Examination
                </Button>
            )
        }else if(s === 'Pending'){
            return (
                <Button
                    disabled={status.loading}
                    onClick={handleCancelApply}
                    variant="contained" color="error" size="small" sx={{ mt: 2 }}>
                    Cancel
                </Button>
            )
        }else if (s === 'Accepted'){
            return(
                <Button
                    disabled={status.loading}
                    onClick={startExam}
                    variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
                    Start Examination
                </Button>
            )
        }
    }

    //Camera
    async function onClickEnableCam(){
        if(enableCam.status){
            setEnableCam({ status: false, info: 'Enable Camera', loading: false })
            try {
                window.stream.getTracks().forEach(track => track.stop())
                window.stream = null
                //const preview = document.getElementById('video-preview')
                //preview.srcObject = null
            }catch{}
        }else{
            setEnableCam({ status: false, info: 'Enable Camera', loading: true })
            try{
                const constraints = {
                    video: {
                        width: 640,
                        height: 480,
                    }
                }
                await navigator.mediaDevices.getUserMedia(constraints)
                    .then((stream) => {
                        window.stream = stream
                        setEnableCam({ status: true, info: 'Disable Camera', loading: false })
                    })
                    .catch((er) => {
                        setEnableCam({ status: true, info: 'Disable Camera', loading: false })
                        console.log(er)
                    })

                const preview = document.getElementById('video-preview')
                preview.srcObject = stream

            }catch (e){
                alert('Unable to start camera \n Please disable cameras on other tabs \n' + e)
            }
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
                {status.loading ? (
                    <AlertCollapse
                        severity="loading"
                        text={status.message}
                        condition={true}
                    />
                ): (
                    <>
                        <Alert text="You have applied for examination to this school. Please wait for their approval."
                               condition={exam_details?.status === 'Pending' && !status.error}/>
                        <Alert text="Your application has been rejected by the school."
                               condition={exam_details?.status === 'Rejected' && !status.error} severity="error"/>
                        <Alert text={status.message}
                               condition={status.error} severity="error"/>
                        <Alert text="Your application has been accepted you can now start your examination."
                               condition={exam_details?.status === 'Accepted' && !status.error}/>
                    </>
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: exam_details?.status === 'Accepted' ? 'space-between': 'end'
                }}>
                    {exam_details?.status === 'Accepted' && (
                        <Box>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ mt: 2 }}
                                color="primary"
                                onClick={onClickEnableCam}
                                disabled={enableCam.loading}
                            >
                                {enableCam.info}
                            </Button>
                        </Box>
                    )}
                    {displayBtn(exam_details?.status)}
                </Box>
                {exam_details?.status === 'Accepted' && (
                    <Box>
                        <Typography variant="caption" mb={2}>
                            If you switched camera disable and enable again.
                        </Typography>
                        <div/>
                        <video id="video-preview"
                               style={{
                                   border: '5px solid #5048E5',
                                   width: '25rem',
                                   height: '19rem',
                                   marginTop: '10px',
                                   marginBottom: '50px',
                                   backgroundColor: '#828282',
                               }}
                               playsInline={true}
                               autoPlay={true}
                               muted={true}/>
                    </Box>
                )}
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
