import {ExamHeader, Questions} from "../../exam/Index";
import {
    Box, Button,
    Container, Tab, Tabs, Typography
} from "@mui/material";
import {memo, useCallback, useEffect, useState} from "react";
import AxiosInstance from "../../../../utils/axiosInstance";
import Loading from "../../../Loading";
//import {useSWRConfig} from "swr";

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

const Single = ({ school, router, id }) => {

    //const { mutate } = useSWRConfig()

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

    const onClickSubmit = async () => {
        setSubmitState({ ...submitState, loading: true })
        await AxiosInstance.post(`student/exam/submit/${school.id}/`, answers)
            .then((_r) => {
                //mutate(`student/exam/start/${school.id}/`, { submitted: true })
                router.push(`/u/results/${id}`)
            }).catch((_e) => {
                setSubmitState({ ...submitState, loading: false })
            })
    }

    if(submitState.loading)
        return <Loading/>


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
