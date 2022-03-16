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

const Single = ({ school, router, id, mutate }) => {

    //const { mutate: mutateSWR } = useSWRConfig()

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

    const submitAns = async () => {
        if(sentToTheServer.current) return
        await AxiosInstance.post(`student/exam/submit/${school.id}/`, answers).then((r) => {
            mutate({ ...school, submitted: true }, false)
            sentToTheServer.current = true
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
                <Loading/>
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
