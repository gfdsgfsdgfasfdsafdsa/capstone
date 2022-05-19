import {ExamHeader, Questions} from "../../exam/Index";
import {
    Box, Button,
    Container, Tab, Tabs, Typography
} from "@mui/material";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import AxiosInstance from "../../../../utils/axiosInstance";
import Loading from "../../../Loading";
import {DateTime} from "luxon";
import AlertCollapse from "../../../AlertCollapse";
import {useSWRConfig} from "swr";
import {DashboardLayout} from "../../../DashboardLayout";
import axios from "axios";

function TabPanel(props) {
    const { children, active } = props;

    return (
        <Typography
            component="div"
            style={{ display: active ? 'unset': 'none' }}
        >
            {children}
        </Typography>
    );
}

const Single = ({ school, router, id, mutate, videoPreview, recordedBlobs, mediaRecorder }) => {

    //const { mutate: mutateSWR } = useSWRConfig()
    const [uploadVid, setUploadVid] = useState({
        status: false,
        percent: 0,
    });

    const [tabValue, setTabValue] = useState(0);
    const [subjectName, setSubjectName] = useState(school.school_exam.exam_subjects[0].name)
    const [answers, setAnswers] = useState({})
    const [examSubject, setExamSubject] = useState(school.school_exam.exam_subjects)

    useEffect(() => {
        school.school_exam.exam_subjects.map((subject) => {
            let a = answers
            a[subject.name] = []
            setAnswers(a)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (_e, newValue) => {
        setTabValue(newValue);
    };

    const setTabFunc = useCallback((value) => {
        setTabValue(value + 1)
    }, [])

    const setSubjectNameF = useCallback((e) => {
        setSubjectName(e.target.dataset?.name ? e.target.dataset?.name : '')
    }, [])

    const [submitState, setSubmitState] = useState({
        loading: false,
    })
    const sentToTheServer = useRef(false)

    const saveResultDetailsSubmitted = useRef(false)
    async function saveResultDetails(video_id){
        if(saveResultDetailsSubmitted.current) return
        saveResultDetailsSubmitted.current = true
        let switchTab = 0
        if(localStorage.getItem(school?.id.toString())){
            switchTab = parseInt(localStorage.getItem(school?.id.toString()))
            localStorage.removeItem(school?.id.toString())
        }
        await AxiosInstance.post(`student/exam/submit/video/${school.id}/`, {
            video_id: video_id,
            tab_switch: switchTab,
        })
            .then(async (_r) => {
            })
    }

    async function uploadVideo(access) {
        const blob = new Blob(recordedBlobs.current, {type: 'video/mp4'});
        const metadata = JSON.stringify({
            name: school?.student_name,
            mimeType: 'video/mp4',
            "parents": ['12UqZihJh8Sb2YdBR19yp34pSxWJ2L-g2'],
        });
        const requestData = new FormData();

        requestData.append("metadata", new Blob([metadata], {
            type: "application/json"
        }));
        requestData.append("file", blob);

        await axios.post('https://www.googleapis.com/upload/drive/v3/files',
            requestData,{
                headers: {
                    Authorization: `Bearer ${access}`,
                    'Content-Type': 'video/mp4',
                },
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength !== null) {
                        setUploadVid({
                            status: true,
                            percent: Math.round((progressEvent.loaded * 100) / totalLength),
                        });
                    }
                }
            }
        ).then(async ({ data }) => {
            await saveResultDetails(data.id)
        }).catch((e) => {
            console.log(e)
        })
    }

    const submitAns = async () => {
        if(sentToTheServer.current) return
        try{
            if(school?.video === 'Enabled'){
                mediaRecorder.current.stop()
                window.stream.getTracks().forEach(track => track.stop())
                window.stream = null
            }
        }catch{}
        await AxiosInstance.post(`student/exam/submit/${school.id}/`, answers).then(async (_r) => {
            sentToTheServer.current = true

            if(school?.video === 'Enabled'){
                let access = ''
                await axios.post('https://www.googleapis.com/oauth2/v4/token', {
                    "client_id": '1046398706985-kh1ef3qo4ntiqdef65n67ll822h8e39f.apps.googleusercontent.com',
                    "client_secret": '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',
                    "refresh_token": '1//04vX330ehMa0JCgYIARAAGAQSNwF-L9Ir1qmhF1IyvHmJElXpbLQ22_kGkqW6MYnjpuDbgV_AmzRmvuuiPm1pb5UYbdGjDvAXa3Y',
                    "grant_type": "refresh_token"
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    access = res.data.access_token
                }).catch((e) => {
                    console.log(e)
                })
                await uploadVideo(access)
            }else{
                await saveResultDetails('Disabled')
            }

            mutate({ ...school, submitted: true }, false)
        })
    }

    const onClickSubmit = async () => {
        setSubmitState({ ...submitState, loading: true })
    }

    //timer
    const [hours, setHours] = useState('00')
    const [minutes, setMinutes] = useState('00')
    const [seconds, setSeconds] = useState('00')
    const [navigator, setNavigator] = useState({
        online: 'yes',
        open: 'no',
    })
    const intervalId = useRef(0)
    let switchCounted = useRef(false)

    useEffect(() => {
        if(!submitState.loading){
            let countDate  = DateTime.fromISO(school?.date_end, { zone: 'Asia/Shanghai' }).ts

            intervalId.current = setInterval(() => {
                const now = DateTime.local().setZone('Asia/Shanghai').ts

                const dist = countDate - now

                let hours = Math.floor(dist % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
                let minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))
                let seconds = Math.floor((dist % (1000 * 60)) / 1000)
                if(dist < 0){
                    setSubmitState({ ...submitState, loading: true })
                    setSeconds(1)
                }else{
                    setHours(hours < 10 ? `0${hours}` : hours)
                    setMinutes(minutes < 10 ? `0${minutes}` : minutes)
                    setSeconds(seconds < 10 ? `0${seconds}` : seconds)
                }
                if(document.visibilityState === 'hidden'){
                    if(!switchCounted.current){
                        if(localStorage.getItem(school?.id.toString())){
                            let v = parseInt(localStorage.getItem(school?.id.toString()))
                            localStorage.setItem(school?.id.toString(), (v+1).toString())
                        }else{
                            localStorage.setItem(school?.id.toString(), "1")
                        }
                        switchCounted.current = true
                    }
                }else{
                    switchCounted.current = false
                }
            }, 1000)

            return  () => clearInterval(intervalId.current)
        }else{
            if(!sentToTheServer.current){
                intervalId.current = setInterval(async () => {
                    const now = DateTime.local().setZone('Asia/Shanghai').ts
                    if(!sentToTheServer.current)
                        setSeconds(now)

                    if (window.navigator.onLine) {
                        if (navigator.online === 'no') {
                            setNavigator({
                                online: 'reconnected',
                                open: 'yes',
                            })
                        }

                        if(!sentToTheServer.current) await submitAns()
                    } else {
                        setNavigator({
                            online: 'no',
                            open: 'yes',
                        })
                    }
                }, 2000)

                return  () => clearInterval(intervalId.current)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds])

    if(submitState.loading){
        return (
            <>
                <Box
                    sx={{
                        px: 3
                    }}
                >
                    <AlertCollapse
                        condition={navigator.online === "no"}
                        text="Connection lost. Please do not refresh wait for the internet to reconnect."
                        severity="error"
                    />
                    <AlertCollapse
                        condition={navigator.online === "reconnected"}
                        text="Reconnected."
                    />
                </Box>
                {uploadVid.status ? (
                    <Loading text={`Uploading video please wait. ${uploadVid.percent}%`}/>
                ): (
                    <Loading/>
                )}
            </>
        )
    }

    const setSubjectNameSubmit = () => {
        setSubjectName('Submit')
    }

    return (
        <>
            <span id="t" style={{ height: '92px', marginTop: '-92px' }}/>
            <Container maxWidth="md">
                <ExamHeader
                    schoolName={school?.name}
                    subject={subjectName}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    videoPreview={videoPreview}
                    videoEnabled={school?.video === 'Enabled'}
                />
                <Container maxWidth={false} sx={{ mt: 3 }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs variant="scrollable"
                                  scrollButtons
                                  allowScrollButtonsMobile
                                  value={tabValue}
                                  onChange={handleChange}
                            >
                                {school.school_exam.exam_subjects.map((subject) => (
                                    <Tab key={subject.id}
                                        label={subject.name}
                                        onClick={setSubjectNameF}
                                         data-name={subject.name}
                                    />
                                ))}
                                <Tab label="Submit"
                                     onClick={setSubjectNameSubmit}
                                />
                            </Tabs>
                        </Box>
                        {examSubject.map((subject, i) => (
                            <TabPanel
                                key={subject.id}
                                active={tabValue === i}
                            >
                                <Questions
                                    subjectId={subject.id}
                                    subjectName={subject.name}
                                    subjectIndex={i}
                                    question={subject}
                                    answers={answers}
                                    setExamSubject={setExamSubject}
                                    examSubject={examSubject}
                                    setAnswers={setAnswers}
                                    setTabFunc={setTabFunc}
                                    setSubjectName={setSubjectName}
                                />
                            </TabPanel>
                        ))}
                        <TabPanel
                               active={tabValue === school.school_exam.exam_subjects.length}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    my: 2,
                                    mt: 5,
                                }}>
                                <Button
                                    onClick={onClickSubmit}
                                    disabled={submitState.loading}
                                    variant="outlined"
                                    sx={{ px:5 }}>
                                    Submit
                                </Button>
                            </Box>
                        </TabPanel>
                    </Box>
                </Container>
            </Container>
        </>
    )
}

export default Single;
