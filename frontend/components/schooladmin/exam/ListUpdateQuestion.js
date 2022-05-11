import {
    Box,
    Button,
    Typography,
    TextField,
    Radio,
    Grid,
    Checkbox,
    Accordion,
    AccordionSummary,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormGroup,
    AccordionDetails,
} from '@mui/material';
import {
    Cancel as CancelIcon,
    Update as UpdateIcon,
} from '@mui/icons-material'
import {memo, useCallback, useEffect, useRef, useState} from 'react'
import questionType from '../../../libs/questionType'
import axiosInstance from "../../../utils/axiosInstance";
import QuestionText from "../../question_layout/QuestionText";
import ImageView from "../../question_layout/ImageView";
import FillInTheBlank from "./components/FillInTheBlank";
import TypeSelectField from './components/TypeSelectField'
import PointsTextField from './components/PointsTextField'
import QuestionTextField from './components/QuestionTextField'
import ImagePreview from './components/ImagePreview'
import ChoiceOption from "./components/ChoiceOption";
import rawHTML from "../../../libs/rawHTML";


const NewChoice = memo(function NewChoice(props) {
    const {
        onClick,
        qId,
        q,
    } = props

    return(
        <>
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={1}/>
                <Grid item xs={11}>
                    <Button
                        sx={{
                            ml: {
                                sm: 1,
                                xs: 0,
                            },
                            mt: {
                                xs: 1,
                                sm: 0,
                            }
                        }}
                        disabled={q.choices?.length >= 5}
                        onClick={() => onClick(qId)}
                        variant="outlined"
                        size="small"
                    >
                        New Choice
                    </Button>
                </Grid>
            </Grid>
        </>
    )
});


const Actions = memo(function Actions(props) {
    const {
        handleUpdate,
        qI,
        q,
    } = props

    return(
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    mt: 3,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={(<UpdateIcon fontSize="small" />)}
                    sx={{ ml: 1 }}
                    onClick={() => handleUpdate(qI, q)}
                >
                    Update
                </Button>
            </Box>
        </>
    )
});


const CheckDelete = memo(function CheckDelete(props) {
    const {
        checkBoxSelected,
        qId,
        qI,
    } = props

    return(
        <>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                Question {qI+1}
                <Checkbox
                    id={`checkbox-question-${qId}`}
                    onClick={() => checkBoxSelected(qId)}
                    size="small"
                />
            </Box>
        </>
    )
});

const QuestionContainer = memo(function QuestionContainer(props) {

    const {
        q,
        qI,
        qId,
        handleChange,
        hideChoices,
        onChangePoints,
        onChangeQuestion,
        onChangeImageQuestion,
        onClickRemoveQuestionImage,

        onChangeOptionText,
        onChangeAnswer,
        onChangeImageOption,
        onClickRemoveOption,
        onClickRemoveOptionImage,

        onChangeType,

        onChangeFillInTheBlank,

        onClickNewOption,
        handleUpdate,

    } = props

    return(
        <>
            <Accordion expanded={q?.expanded === `panel${q.id}`}
                       onChange={() => handleChange(q.id)}
                       className={q?.expanded === `panel${q.id}`? 'left-border': ''}
                       TransitionProps={{ timeout: 0 }}
                       sx={{
                           margin: '0 0'
                       }}
            >
                <AccordionSummary
                    aria-controls={`panel${q.id}bh-content`}
                    id={`panel${q.id}bh-header`}
                    sx={{ minHeight: 0 }}
                >
                    {`panel${q.id}` !== q?.expanded && (
                        <Box sx={{ width: '100%' }} px={3}>
                            <Box py={3}>
                                <DefaultDisplay
                                    q={q}
                                    qI={qI}
                                    hideChoices={hideChoices}
                                />
                            </Box>
                        </Box>
                    )}
                </AccordionSummary>
                <AccordionDetails>
                    <Box px={3}
                         sx={{ paddingTop: '25px'}}
                    >
                        {questionType[q.type] !== questionType.Rating && (
                            <PointsTextField
                                id={q.id}
                                value={q.score}
                                onChange={onChangePoints}/>
                        )}
                        <QuestionTextField
                            id={q.id}
                            questionIndex={qI}
                            value={q.text}
                            onChangeImageQuestion={onChangeImageQuestion}
                            onChange={onChangeQuestion}/>
                        <ImagePreview
                            id={q.id}
                            image={q.imagePreview ? q.imagePreview : q.image}
                            onClick={onClickRemoveQuestionImage}
                        />
                        <TypeSelectField
                            questionIndex={qI}
                            qId={q.id}
                            value={questionType[q.type]}
                            onChange={onChangeType}/>
                        {questionType[q.type] === questionType.FillInTheBlank ? (
                            <FillInTheBlank
                                qId={q.id}
                                onChange={onChangeFillInTheBlank}
                                question={q.text}
                                choice={q.choices[0].correct}
                            />
                        ) : (
                            <Box mt={2}>
                                <Typography variant="body2">
                                    Choices
                                </Typography>
                                {questionType[q.type] === questionType.Rating && (
                                    <Typography variant="caption">
                                        The number indicates score
                                    </Typography>
                                )}
                                {q?.choices?.map((c, choiceIndex) => (
                                    <Box key={choiceIndex}>
                                        <ChoiceOption
                                            image={c.imagePreview ? c.imagePreview : c.image}
                                            choiceIndex={choiceIndex}
                                            questionIndex={qI}
                                            text={c.text}
                                            id={q.id}
                                            qId={q.id}
                                            cId={c.id}
                                            type={q.type}
                                            correct={c.correct}
                                            displayCloseButton={q?.choices?.length > 1}
                                            onChange={onChangeOptionText}
                                            onChangeAnswer={onChangeAnswer}
                                            onChangeImageOption={onChangeImageOption}
                                            onClickRemoveOption={onClickRemoveOption}
                                            onClickRemoveOptionImage={onClickRemoveOptionImage}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                        {questionType[q.type] !== questionType.FillInTheBlank && (
                            <NewChoice
                                onClick={onClickNewOption}
                                qId={qId}
                                q={q}
                            />
                        )}
                        <Actions
                            qI={qI}
                            q={q}
                            handleUpdate={handleUpdate}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    )
});

const DefaultDisplay = memo(function DefaultDisplay(props) {
    const { q, qI, hideChoices = false } = props

    function display(q, qI, hideChoices){
        if(questionType[q.type] === questionType.MultipleChoice || questionType[q.type] === questionType.Rating){
            return (
                <FormControl>
                    <QuestionText
                        question={q.text}
                        no={qI+1}
                        image={q.imagePreview ? q.imagePreview : q.image}
                    />
                    {!hideChoices && (
                        <RadioGroup
                            name="radio-buttons-group"
                            sx={{
                                ml: 3,
                                marginTop: '2px'
                            }}
                        >
                            {q.choices.map((c, i) => {
                                return (
                                    <Box key={i}>
                                        <FormControlLabel
                                            value={c.id}
                                            control={<Radio size="small"/>}
                                            checked={c.correct === 'true'}
                                            label={rawHTML((c.text))}
                                        />
                                        <ImageView image={c.imagePreview ? c.imagePreview : c.image}/>
                                    </Box>
                                )
                            })}
                        </RadioGroup>
                    )}
                    {questionType[q.type] === questionType.MultipleChoice && (
                        <Typography component="div" variant="caption" mt={1}>
                            Points: {q.score}
                        </Typography>
                    )}
                </FormControl>
            )
        }else if(questionType[q.type] === questionType.CheckBox){
            let scoreCnt = 0
            return (
                <FormGroup>
                    <QuestionText
                        question={q.text}
                        no={qI+1}
                        image={q.imagePreview ? q.imagePreview : q.image}
                    />
                    {!hideChoices && (
                        q.choices.map((c, i) => {
                            if(c.correct === 'true')
                                scoreCnt += q.score
                            return(
                                <Box key={i}>
                                    <FormControlLabel
                                        sx={{ ml: 2}}
                                        control={<Checkbox size="small"/>}
                                        checked={c.correct === 'true'}
                                        label={rawHTML((c.text))}
                                    />
                                    <ImageView image={c.imagePreview ? c.imagePreview : c.image}/>
                                </Box>
                            )
                        })
                    )}
                    <Typography component="div" variant="caption" mt={1}>
                        Points: {scoreCnt}
                    </Typography>
                </FormGroup>
            )
        }else if(questionType[q.type] === questionType.FillInTheBlank){
            let hasImage = q.imagePreview || q.image
            return (
                <>
                    {hasImage && (
                        <QuestionText
                            no={qI+1}
                            image={q.imagePreview ? q.imagePreview : q.image}
                        />
                    )}
                    <Typography
                        component="div"
                        variant="subtitle2"
                        sx={{ whiteSpace: 'pre-wrap', ml: 1 }}
                    >
                        {!hasImage && (
                            <Typography component="span" sx={{ mr: 2 }}>
                                {qI + 1}
                            </Typography>
                        )}
                        {q.text.split('_').map((text, i) => {
                            return (
                                <Typography key={i} component="span" variant="body1">
                                    {i >= 1 ? (
                                        <>
                                            <TextField
                                                sx={{
                                                    mt: 1,
                                                    width: "110px",
                                                    "& .MuiOutlinedInput-input": {
                                                        padding: "6px"
                                                    }
                                                }}
                                                autoComplete="off"
                                                disabled={true}
                                            />
                                            <Typography component="span" sx={{ lineHeight: "47px" }}>
                                                {rawHTML(text)}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography component="span" sx={{ lineHeight: "40px" }}>
                                            {rawHTML(text)}
                                        </Typography>
                                    )}
                                </Typography>
                            );
                        })}
                    </Typography>
                    <Typography component="div" variant="caption" mt={1}>
                        Points: {q.score}
                    </Typography>
                    <Typography component="div" variant="caption" mt={1}>
                        Correct Answer: {q.choices[0].correct}
                    </Typography>
                </>
            )
        }
    }

    return (
        <Box>
            {display(q, qI, hideChoices)}
        </Box>
    )
});

function ListUpdateQuestion({ subjectQuestions, setStatus, checked, setChecked, hideChoices, mutate, state }){
    //always use Json.parse so the original backup will not be modified
    //const bak = useRef(JSON.parse(JSON.stringify(subjectQuestions)))
    const [questions, setQuestions] = useState(subjectQuestions)
    const backup = useRef(null)

    useEffect(() => {
        //bak.current = JSON.parse(JSON.stringify(subjectQuestions))
        setQuestions(subjectQuestions)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectQuestions])

    /*
    useEffect(() => {
        mutate(`school/exam/subject/${subjectId}/questions/`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
     */

    /*
    const handleChange = (qI) => (event, isExpanded) => {
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })
        //prevent from closing
        const panel = `panel${qI}`
        console.log(isExpanded)
        if(panel !== expanded)
            setExpanded(isExpanded ? panel : false);
    }
     */
    const lastOpen = useRef('')

    const handleChange = useCallback((qId) => {
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })
        //prevent from closing
        const panel = `panel${qId}`
        let ques = null
        if(panel !== questions?.expanded){
            setQuestions(setPrev => {
                return setPrev.map((question) => {
                    if(question.id === qId){
                        ques = question
                        return { ...question, expanded: panel }
                    }else if(question.id === lastOpen.current && backup.current !== null){
                            return { ...backup.current, expanded: '' }
                    }

                    return question
                })
            })
            backup.current = ques
            lastOpen.current = qId
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /*
    const handleCancel = () => {
        setQuestions(JSON.parse(JSON.stringify(bak.current)))
    }
    const handleCancel = useCallback((qId) => {
        setQuestions(setPrev => {
            return setPrev.map((question) => {
                if(question.id === qId){
                    return backup.current
                }

                return question
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
     */

    const handleUpdate = useCallback(async (qI, q) => {
        setStatus({ error: false, loading: false, success: false, infoMessage: '' })
        let data = new FormData()
        let total_score = 0
        //questions[qI].
        data.append('id', q.id)
        data.append('text', q.text)
        if(q.image?.name)
            data.append('images', q.image, 0)
        else
        if(q.image)
            data.append('images', '0exist')
        else
            data.append('images', null)

        data.append('type', q.type)

        if(questionType[q.type] === questionType.Rating)
            data.append('score', 0)
        else
            data.append('score', q.score)
        //validate
        if(!q.text || !q.score && questionType[q.type] !== questionType.Rating){
            setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Fields Cannot be empty.` })
            return
        }

        if(questionType[q.type] === questionType.FillInTheBlank){
            data.append('images', null)
            let qLength = q.text.split('_').length - 1
            total_score = qLength
            if(qLength <= 0){
                setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Please set a correct answer.` })
                return
            }
            let ansLength = q.choices[0].correct.split(',')
            if(ansLength.length !== qLength){
                let newCorrect = ''
                for(let i = 0; i < qLength; i++){
                    if(ansLength[i] === undefined) break
                    if(i + 1 === qLength){
                        newCorrect += ansLength[i]
                    }else{
                        newCorrect += ansLength[i] + ','
                    }
                }
                q.choices[0].correct = newCorrect
            }
            for(let i = 0; i < qLength; i++){
                if(!ansLength[i]){
                    setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Please set a correct answer.` })
                    return
                }
            }
            let cd = {
                "text": '',
                "correct": q.choices[0].correct,
            }
            data.append('choices_list', JSON.stringify(cd))

            total_score *= q.score

        }else if(questionType[q.type] === questionType.Rating){
            let emptyField = false
            q.choices.forEach((c, i) => {
                data.append('images', null)

                let cd = {
                    "text": c.text,
                    "correct": (i + 1).toString(),
                }
                if(!c.text){
                    emptyField = true
                }
                if(c.id)
                    cd['id'] = c.id
                data.append('choices_list', JSON.stringify(cd))
            })
            if(emptyField){
                setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Fields Cannot be empty.` })
                return
            }

            total_score = q.choices.length
        }else {
            let hasCorrect = false
            let emptyField = false
            q.choices.forEach((c, i) => {
                if(c.image?.name)
                    data.append('images', c.image, i + 1)
                else
                if(c.image)
                    data.append('images', `${i+1}exist`)
                else
                    data.append('images', null)

                let cd = {
                    "text": c.text,
                    "correct": c.correct,
                }
                if(!c.text){
                    emptyField = true
                }
                if(c.correct === 'true'){
                    hasCorrect = true
                    total_score++
                }

                if(c.id)
                    cd['id'] = c.id
                data.append('choices_list', JSON.stringify(cd))
            })
            if(emptyField){
                setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Fields Cannot be empty.` })
                return
            }

            if(!hasCorrect){
                setStatus({ error: true, loading: false, success: false, infoMessage: `Question ${qI+1}: Please select correct answer.` })
                return
            }

            total_score *= q.score
        }
        data.append('current_score', total_score)
        if(total_score === 0){
            setStatus({ error: true, loading:false, success: false, infoMessage: `Question ${qI+1}: Invalid Points.` })
            return
        }

        setStatus({ error: false, loading: true, success: false, infoMessage: 'Saving...' })
        setQuestions(prev =>
            prev.map(item => (item.id === q.id ? { ...item, expanded: '' } : item))
        );

        await axiosInstance.patch(`/school/exam/subject/questions/${q.id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((_r) => {
            //bak.current = JSON.parse(JSON.stringify(questions))
            setStatus({
                error: false, loading:false, success: true, infoMessage: 'Updated.' })
            setQuestions(prev =>
                prev.map(item => (item.id === q.id ? { ...q, expanded: '' } : item))
            );
            mutate({ ...state, current_score: state.current_score + total_score })
            backup.current = null
        }).catch((_e) => {
            setQuestions(prev =>
                prev.map(item => (item.id === q.id ? { ...item, expanded: `panel${q.id}` } : item))
            );
            setStatus({ error: true, loading:false, success: false, infoMessage: 'Failed to saved question.' })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    //fpoints
    const onChangePoints = useCallback((e, id) => {
        setQuestions(prev =>
            prev.map(item => (item.id === id ? { ...item, score: e.target.value } : item))
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //fquestion
    const onChangeQuestion = useCallback((e, id) => {
        /*
        let q = [...questions]
        q[questionIndex].text = e.target.value
        setQuestions(q)
        */
        setQuestions(prev =>
            prev.map(item => (item.id === id ? { ...item, text: e.target.value } : item))
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeImageQuestion = useCallback((e, id) => {
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            if(file){
                setQuestions(prev =>
                    prev.map(item =>
                        item.id === id ?
                            {
                                ...item,
                                image: file,
                                imagePreview: URL.createObjectURL(file)
                            }
                            : item)
                );
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickRemoveQuestionImage = useCallback((e, id) => {
        setQuestions(prev =>
            prev.map(item =>
                item.id === id ?
                    {
                        ...item,
                        image: null,
                        imagePreview: null
                    }
                    : item)
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //ftype
    const onChangeType = useCallback((e, qId) => {
        setQuestions(prev => {
            let type = e.target.value
            return prev.map((question) => {
                if(question.id === qId){
                    if(type === questionType.FillInTheBlank){
                        return {
                            ...question,
                            type: questionType[type],
                            choices: [{
                                text: '',
                                correct: '',
                                image: null,
                            }],
                        }
                    }
                    /*
                    else if(type === questionType.TrueOrFalse){
                        return {
                            ...question,
                            type: questionType[type],
                            choices: [
                                {
                                    text: 'True',
                                    correct: 'true',
                                    image: null,
                                },
                                {
                                    text: 'False',
                                    correct: 'false',
                                    image: null,
                                },
                            ],
                        }
                    }
                     */
                    else{
                        return {
                            ...question,
                            type: questionType[type],
                            choices: [{
                                text: 'Answer1',
                                correct: 'false',
                                image: null,
                            }],
                        }
                    }
                }

                return question
            })
        });
        /*
         let q = [...questions]
        q[questionIndex].type = questionType[e.target.value]

        if(e.target.value === questionType.FillInTheBlank){
            q[questionIndex].choices[0].correct = ''
        }else if(e.target.value === questionType.TrueOrFalse){
            let newChoice = [
                {text: 'True', image: null, correct: 'false'},
                {text: 'False', image: null, correct: 'false'}
            ]
            q[questionIndex].choices = newChoice
        }else{
            if(q[questionIndex].choices[0].text === 'True'){
                let newChoice = [
                    {text: 'Answer1', image: null, correct: 'false'}
                ]
                q[questionIndex].choices = newChoice
            }else{
                for(let i = 0; i < q[questionIndex].choices.length; i++){
                    q[questionIndex].choices[i].correct = "false"
                }
            }
        }
        setQuestions(q)
        */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //foption
    const onChangeFillInTheBlank = useCallback((e, i, qId) => {
        /*
        let q = [...questions]
        let a = q[questionIndex].choices[0].correct.split(',')
        a[i - 1] = e.target.value
        q[questionIndex].choices[0].correct = a.join(',')
        setQuestions(q)
        */
        setQuestions(prev => {
            return prev.map((question) => {
                if(question.id === qId){
                    let a = question.choices[0].correct.split(',')
                    a[i - 1] = e.target.value
                    return {
                        ...question,
                        choices: [{
                            text: '',
                            correct: a.join(','),
                            image: null,
                        }],
                    }
                }

                return question
            })
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //fchoice
    const onChangeOptionText = useCallback((e, qId, cI) => {
        /*
        let q = [...questions]
        q[questionIndex].choices[choiceIndex].text = e.target.value
        setQuestions(q)
         */
        setQuestions(prev =>
            prev.map(item =>
                item.id === qId ?
                    {
                        ...item,
                        choices: item.choices.map((choice, i) =>
                             i === cI ?
                                {
                                    ...choice,
                                    text: e.target.value
                                }: choice)

                    }
                    : item)
        );


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onChangeAnswer = useCallback((qId, cI, isCheckBox = false) => {
        /*
        let q = [...questions]
        if(isCheckBox){
            q[qI].choices[cI].correct = q[qI].choices[cI].correct === 'true' ? 'false' : 'true'
        }else{
            for(let i = 0; i < q[qI].choices.length; i++){
                q[qI].choices[i].correct = 'false'
            }
            q[qI].choices[cI].correct = 'true'
        }
        setQuestions(q)
        */
        setQuestions(prev => {
            return prev.map((question) => {
                if(question.id === qId) {
                    if (isCheckBox) {
                        return {
                            ...question,
                            choices: question.choices.map((choice, i) =>
                                 i === cI ?
                                    {
                                        ...choice,
                                        correct: choice.correct === 'true' ? 'false' : 'true'
                                    } : choice)
                        }
                    } else {
                        return {
                            ...question,
                            choices: question.choices.map((choice, i) =>
                                i === cI ?
                                    {
                                        ...choice,
                                        correct: 'true',
                                    } : {
                                        ...choice,
                                        correct: 'false',
                                    })
                        }
                    }
                }
                return question
            })
        })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickNewOption = useCallback((qId) => {
        /*
        let q = [...questions]
        q[qI].choices.push({
            text: "",
            image: null,
            correct: "false",
        })
        setQuestions(q)
        */
        setQuestions(prev => {
            return prev.map((question) => {
                if(question.id === qId) {
                    return {
                        ...question,
                        choices: [
                            ...question.choices,
                            { text: '', image: null, correct: 'false' }
                        ],
                    }
                }
                return question
            })
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeImageOption = useCallback((e, qId, cI) => {
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            if(file){
                /*
                let q = [...questions]
                q[qI].choices[cI].image = file
                q[qI].choices[cI].imagePreview = URL.createObjectURL(file)
                setQuestions(q)
                */
                setQuestions(setPrev =>
                    setPrev.map(question =>
                        question.id === qId ?
                            {
                                ...question,
                                choices: question.choices.map((choice, i) =>
                                    cI === i ?
                                        {
                                            ...choice,
                                            image: file,
                                            imagePreview: URL.createObjectURL(file)
                                        }: choice)

                            }
                            : question)
                );
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setQuestions]);

    const onClickRemoveOption = useCallback((qId, cI) => {
        /*
        let q = [...questions]
        q[qI].choices.splice(cI, 1)
        setQuestions(q)
         */

        setQuestions(prev => {
            return prev.map((question) => {
                if(question.id === qId) {
                    return {
                        ...question,
                        choices: question.choices.filter((choice, i) => cI !== i)
                    }
                }
                return question
            })
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickRemoveOptionImage = useCallback((qId, cI) => {
        setQuestions(setPrev =>
            setPrev.map(question =>
                question.id === qId ?
                    {
                        ...question,
                        choices: question.choices.map((choice, i) =>
                            i === cI ?
                                {
                                    ...choice,
                                    image: null,
                                    imagePreview: null
                                }: choice)

                    }
                    : question)
        )
        /*
        let q = [...questions]
        q[qI].choices[cI].imagePreview = null
        q[qI].choices[cI].image = null
        setQuestions(q)
        */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const checkBoxSelected = useCallback((id) => {
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })
        setChecked(setPrev => {
            let c = [...setPrev]
            if(c.includes(id)){
                const index = c.indexOf(id);
                if (index > -1) {
                    c.splice(index, 1); // 2nd parameter means remove one item only
                }
            }else{
                c.push(id)
            }
            return c
        })
        /*
        let q = [...questions]
        q[qI].choices[cI].imagePreview = null
        q[qI].choices[cI].image = null
        setQuestions(q)
        */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

/*
    function checkBoxSelected(id){
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })
        let c = [...checked]
        if(c.includes(id)){
            const index = c.indexOf(id);
            if (index > -1) {
                c.splice(index, 1); // 2nd parameter means remove one item only
            }
        }else{
            c.push(id)
        }
        setChecked(c)
    }
 */

    //freturn
    return (
        <Box
            sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '800px' }}>
                {questions.map((q, qI) => {
                    return(
                        <Box
                            mt={2}
                            key={q.id}>
                            <CheckDelete
                                checkBoxSelected={checkBoxSelected}
                                qI={qI}
                                qId={q.id}
                            />
                            <QuestionContainer
                                q={q}
                                qI={qI}
                                qId={q.id}
                                handleChange={handleChange}
                                hideChoices={hideChoices}
                                onChangePoints={onChangePoints}
                                onChangeImageQuestion={onChangeImageQuestion}
                                onChangeQuestion={onChangeQuestion}
                                onClickRemoveQuestionImage={onClickRemoveQuestionImage}
                                onChangeOptionText={onChangeOptionText}
                                onChangeAnswer={onChangeAnswer}
                                onChangeImageOption={onChangeImageOption}
                                onClickRemoveOption={onClickRemoveOption}
                                onClickRemoveOptionImage={onClickRemoveOptionImage}
                                onChangeType={onChangeType}
                                onChangeFillInTheBlank={onChangeFillInTheBlank}
                                onClickNewOption={onClickNewOption}
                                handleUpdate={handleUpdate}
                            />
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default ListUpdateQuestion