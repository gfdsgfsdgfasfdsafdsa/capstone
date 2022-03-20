import {
    Typography,
    Box,
    Radio,
    TextField,
    Checkbox,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormGroup,
    Card,
    CardContent,
    Button,
} from '@mui/material'
import questionType from "../../../libs/questionType";
import QuestionText from "../../question_layout/QuestionText";
import ImageView from "../../question_layout/ImageView";
import FillInTheBlank from "../../question_layout/FillInTheBlank";
import {memo, useCallback} from "react";
import MultipleChoices from "../../question_layout/MultipleChoices";
import CheckboxChoices from "../../question_layout/CheckboxChoices";

const NextButton = memo(function NextButton(props) {
    const {
        setTabFunc,
        subjectIndex
    } = props

    return(
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    my: 5,
                }}>
                <Button variant="contained"
                        component="a"
                        href="#t"
                        lsx={{ px:5 }}
                        onClick={() => setTabFunc(subjectIndex)}>
                    Next
                </Button>
            </Box>
        </>
    )
});

function Questions({ subjectIndex, question, answers, setAnswers,
                                      examSubject, setExamSubject, subjectId, subjectName, setTabFunc }) {

    const onClickMultipleChoice = useCallback((questionIndex, choiceIndex, qId, cId) => {
        let a = answers
        a[question.name][questionIndex] = {
            'id': qId,
            'answer': cId,
        }
        setAnswers(a)

        let x = [...examSubject]
        let length = x[subjectIndex].subject_questions[questionIndex].choices.length
        for(let i = 0; i < length; i++){
            x[subjectIndex].subject_questions[questionIndex].choices[i].answer = false
        }
        x[subjectIndex].subject_questions[questionIndex].choices[choiceIndex].answer = true
        setExamSubject(x)

        /*
        setAnswers((prevState) => {
            for (let key of Object.keys(prevState)) {
                if(key === subjectName){
                    let found = false
                    let item = prevState[key].map((value) => {
                        if(value === undefined) return

                        if(value.id === qId){
                            found = true
                            return { ...value, answer: cId }
                        }
                        return value
                    })
                    if(found)
                        return { ...prevState, [key]: item }
                    else
                        return { ...prevState, [key]: [...prevState[key], { id: qId, answer: cId }] }
                }
            }
            return prevState
        })
        setExamSubject((prevState) =>
            prevState.map((subject) =>
                subject.id === subjectId ?
                    {
                        ...subject,
                        subject_questions: subject.subject_questions.map((question) =>
                            question.id === qId ?
                                {
                                    ...question,
                                    choices: question.choices.map((choice) =>
                                        choice.id === cId ?
                                            {
                                                ...choice,
                                                answer: true
                                            }: { ...choice, answer: false })
                                }: question)
                    } : subject
            )
      );
       */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeFillInTheBlank = useCallback((e, questionIndex, i, qId) => {
        let a = answers
        let boxAns = []
        if(a[question.name][questionIndex]?.answer){
            boxAns = [...a[question.name][questionIndex]?.answer]
        }
        boxAns[i] = e.target.value
        a[question.name][questionIndex] = {
            'id': qId,
            'answer': boxAns,
        }
        setAnswers(a)
        //console.log(answers)
        let x = [...examSubject]

        /*
        if(!Array.isArray(x[subjectIndex].subject_questions[questionIndex].choices[0].answer)){
            const length = x[subjectIndex].subject_questions[questionIndex].text.split('_').length - 1
            x[subjectIndex].subject_questions[questionIndex].choices[0].answer = new Array(length).fill('');
        }
         */

        x[subjectIndex].subject_questions[questionIndex].choices[0].answer = boxAns.join(',')

        setExamSubject(x)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setExamSubject, setAnswers]);

    const onClickCheckBox = useCallback((e, questionIndex, choiceIndex, qId, cId) => {
        let a = answers
        let ansList = []
        let x = [...examSubject]
        x[subjectIndex].subject_questions[questionIndex].choices[choiceIndex].answer = e.target.checked
        let data = x[subjectIndex].subject_questions[questionIndex].choices

        for (let i = 0; i < data.length; i++){
            if(data[i].answer){
                ansList.push(data[i].id)
            }
        }

        a[question.name][questionIndex] = {
            'id': qId,
            'answer': ansList,
        }

        setAnswers(a)
        setExamSubject(x)
        /*
        setExamSubject((prevState) =>
            prevState.map((subject) =>
                subject.id === subjectId ?
                    {
                        ...subject,
                        subject_questions: subject.subject_questions.map((question) =>
                            question.id === qId ?
                                {
                                    ...question,
                                    choices: question.choices.map((choice) =>
                                        choice.id === cId ?
                                            {
                                                ...choice,
                                                answer: e.target.checked
                                            }: choice)
                                }: question)
                    } : subject
            )
        );
        setAnswers((prevState) => {
            for (let key of Object.keys(prevState)) {
                if(key === subjectName){
                    let found = false
                    let item = prevState[key].map((value) => {
                        if(value === undefined) return

                        if(value.id === qId){
                            let newAnswer = [...value.answer]
                            found = true
                            if(e.target.checked){
                                newAnswer.push(cId)
                            }else{
                                if(newAnswer.includes(cId)){
                                    const index = newAnswer.indexOf(cId);
                                    if (index > -1) {
                                        newAnswer.splice(index, 1);
                                    }
                                }
                            }
                            return { ...value, answer: newAnswer }
                        }
                        return value
                    })
                    if(found)
                        return { ...prevState, [key]: item }
                    else
                        return { ...prevState, [key]: [...prevState[key], { id: qId, answer: [cId] }] }
                }
            }
            return prevState
        })
         */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setExamSubject]);

    return (
        <Box sx={{ mt: 1 }}>
            {question.subject_questions.map((q, questionIndex) => {
                return(
                    <Card key={q.id} sx={{ mt: 3 }}>
                        <CardContent>
                            {/*questionUi(subjectIndex ,i, q, answers, setAnswers, question.name, examSubject, setExamSubject)*/}
                            {(questionType[q.type] === questionType.MultipleChoice || questionType[q.type] === questionType.Rating) && (
                                <FormControl>
                                    <QuestionText
                                        question={q.text}
                                        no={questionIndex+1}
                                        image={q.image}
                                    />
                                    <RadioGroup
                                        sx={{ml: 3, marginTop: '3px'}}>
                                        {q.choices?.map((c, choiceIndex) => {
                                            return (
                                                <Box key={c.id}>
                                                    <MultipleChoices
                                                        onClick={onClickMultipleChoice}
                                                        choiceIndex={choiceIndex}
                                                        questionIndex={questionIndex}
                                                        questionId={q.id}
                                                        choiceId={c.id}
                                                        answer={c.answer}
                                                        text={c.text}
                                                    />
                                                    <ImageView image={c.image}/>
                                                </Box>
                                            )
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            )}
                            {questionType[q.type] === questionType.CheckBox && (
                                <FormGroup>
                                    <Typography variant="subtitle1" sx={{ marginBottom: '15px' }}>
                                        <QuestionText
                                            question={q.text}
                                            no={questionIndex+1}
                                            image={q.image}
                                        />
                                        <Typography variant="caption" component="div" ml={2}>
                                            select {examSubject[subjectIndex].subject_questions[questionIndex].cb_limit} answer
                                        </Typography>
                                    </Typography>
                                    {q.choices.map((c, choiceIndex) => {
                                        let x = [...examSubject]
                                        let length = x[subjectIndex].subject_questions[questionIndex].choices.length
                                        let checkBoxLimit = x[subjectIndex].subject_questions[questionIndex].cb_limit
                                        let ansCnt = 0
                                        for(let i = 0; i < length; i++){
                                            if(x[subjectIndex].subject_questions[questionIndex].choices[i].answer){
                                                ansCnt++
                                            }
                                        }

                                        return(
                                            <Box key={c.id}>
                                                <CheckboxChoices
                                                    disable={ansCnt >= checkBoxLimit && !c.answer}
                                                    checked={c.answer}
                                                    onClick={onClickCheckBox}
                                                    question={c.text}
                                                    choiceId={c.id}
                                                    questionIndex={questionIndex}
                                                    choiceIndex={choiceIndex}
                                                    id={q.id}
                                                />
                                                <ImageView image={c.image}/>
                                            </Box>
                                        )
                                    })}
                                </FormGroup>
                            )}
                            {questionType[q.type] === questionType.FillInTheBlank && (
                                <FillInTheBlank
                                    image={q.image}
                                    question={q.text}
                                    onChange={onChangeFillInTheBlank}
                                    questionIndex={questionIndex}
                                    choice={examSubject[subjectIndex].subject_questions[questionIndex].choices[0].answer}
                                    id={q.id}
                                />
                            )}
                        </CardContent>
                    </Card>
                )
            })}
            {/*
            <Card>
                <CardContent>
                    <FormControl>
                        <Typography variant="h6">
                            1. Question !
                        </Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            sx={{ ml: 3, marginTop: '2px' }}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
                <CardContent>

                    <FormGroup >
                        <Typography variant="h6">
                            1. Question !
                        </Typography>
                        <FormControlLabel sx={{ ml: 2, marginTop: '2px' }} control={<Checkbox defaultChecked />} label="Label" />
                    </FormGroup>

                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <FormGroup >
                        <Typography variant="h6">
                            2.Queston
                        </Typography>
                        <TextField sx={{ marginTop: '20px' }} variant="standard" placeholder="Enter your Answer" />
                    </FormGroup>

                </CardContent>
            </Card>
            */}
            <NextButton
                setTabFunc={setTabFunc}
                subjectIndex={subjectIndex}
            />
        </Box>
    )
}

export default memo(Questions)