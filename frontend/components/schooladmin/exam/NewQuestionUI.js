import {
    Box,
    Button,
    Typography,
    TextField,
    Radio,
    Grid,
    Checkbox,
    IconButton,
} from '@mui/material';
import {
    CropOriginal as CropOriginalIcon,
    Cancel as CancelIcon,
    Save as SaveIcon,
} from '@mui/icons-material'
import {memo, useCallback, useEffect, useState} from 'react'
import AxiosInstance from "../../../utils/axiosInstance";
import questionType from "../../../libs/questionType";
import TypeSelectField from './components/TypeSelectField'
import PointsTextField from './components/PointsTextField'
import QuestionTextField from './components/QuestionTextField'
import ImagePreview from './components/ImagePreview'
import QuestionContainer from "./components/QuestionContainer";

const FillInTheBlankBox = memo(function FillInTheBlankBox(props) {
    const {onChange, q, i, ans } = props

    return (
        <>
            <TextField
                sx={{
                    mt: 1,
                    width: "110px",
                    "& .MuiOutlinedInput-input": {
                        padding: "6px"
                    }
                }}
                value={ans}
                onChange={(e) => onChange(e, i)}
                autoComplete="off"
            />
            <Typography component="span" sx={{ lineHeight: "50px" }}>
                {q}
            </Typography>
        </>
    )
})

const FillInTheBlank = memo(function FillInTheBlank(props) {
    const { question, onChange, ans } = props

    return (
        <Typography
            component="div"
            variant="subtitle2"
            sx={{ whiteSpace: 'pre-wrap' }}
        >
            {question.split("_").map((q, i) => {
                return (
                    <Typography key={i} variant="div">
                        {i >= 1 ? (
                            <FillInTheBlankBox
                                onChange={onChange}
                                q={q}
                                i={i}
                                ans={ans[i - 1] ? ans[i - 1] : ''}
                            />
                        ) : (
                            <Typography component="span" sx={{ lineHeight: "40px" }}>{q}</Typography>
                        )}
                    </Typography>
                );
            })}
        </Typography>
    )
});

const NewQuestionUI = ({ mutate, routerId, setStatus, subjectQuestions }) => {

    const [question, setQuestion] = useState({
        text: '',
        image: null,
        imagePreview: null,
    })
    const [manualReset, setManualReset] = useState(false)

    const [type, setType] = useState('multipleChoice')
    const [option, setOption] = useState({
        value: [
            { text: 'Answer1', image: null, imagePreview: null, isAnswer: false },
        ],
    })
    const [fillInTheBlankAns, setFillInTheBlankAns] = useState([])
    const [score, setScore] = useState(1)

    function reset(){
        setQuestion({
            text: '',
            image: null,
            imagePreview: null,
        })
        setType(questionType.MultipleChoice)
        setOption({
            value: [
                { text: '', image: null, imagePreview: null, isAnswer: false },
            ],
        })
        setFillInTheBlankAns([])
        setScore(1)
    }

    const onChangeOption = (e, i) => {
        let optionValue = [...option.value];
        optionValue[i].text = e.target.value
        setOption({ value: optionValue });
    }

    function onChangeImageOption(e, i){
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            if(file){
                let optionValue = [...option.value];
                optionValue[i].image = e.target.files[0]
                optionValue[i].imagePreview = URL.createObjectURL(file)
                setOption({ value: optionValue });
            }
        }
        e.currentTarget.value = null
    }

    function removeImageFromOption(e, i){
        let optionValue = [...option.value];
        optionValue[i].image = null
        optionValue[i].imagePreview = null
        setOption({ value: optionValue });
    }

    const handleAnswerChange = (j, isCheckBox = false) => {
        let optionValue = [...option.value];
        if (!isCheckBox) {
            for (let i = 0; i < optionValue.length; i++) {
                optionValue[i].isAnswer = false
            }
            optionValue[j].isAnswer = true
        } else {
            optionValue[j].isAnswer = !optionValue[j].isAnswer
        }
        setOption({ value: optionValue });
    }

    const onChangeTypeSelect = (e) => {
        setType(e.target.value)
        /*
        if(e.target.value === questionType.TrueOrFalse){
            setOption({
                value: [
                    { text: 'True', isAnswer: false },
                    { text: 'False', isAnswer: false }
                ]
            });
            return
        }
         */
        let optionValue = [...option.value];
        /*
        if(option.value[0].text === 'True'){
            optionValue.splice(1, optionValue.length - 1)
            optionValue[0].text = "Answer1"
        }
        */
        for (let i = 0; i < optionValue.length; i++) {
            optionValue[i].isAnswer = false
        }
        setOption({ value: optionValue });
    }

    /*
    const onChangeFillInTheBlanks = (e, i) => {
        i -= 1
        const ans = [...fillInTheBlankAns]
        ans[i] = e.target.value
        setFillInTheBlankAns(ans)
    }
     */

    const onChangeFillInTheBlanks = useCallback((e, i) => {
        setFillInTheBlankAns(prevState => {
            const ans = [...prevState]
            ans[i - 1] = e.target.value
            return ans
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSave = async () => {
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })
        //validate
        if(!question.text || !score){
            setStatus({ error: true, loading:false, success: false, infoMessage: 'Error: Text Fields cannot be empty.' })
            return false
        }

        try{
            let total_score = 0
            let data = new FormData()
            data.append('text', question.text)
            if(question.image)
                data.append('images', question.image, 0)
            else
                data.append('images', null)

            data.append('type', questionType[type])
            data.append('score', score)
            if(type === questionType.FillInTheBlank){
                //validate
                let blanksLength = question.text.split('_').length - 1
                if(blanksLength === 0){
                    setStatus({ error: true, loading:false, success: false, infoMessage: 'Error: Please enter answer.' })
                    return false
                }else{
                    for(let i = 0; i < blanksLength; i++){
                        if(fillInTheBlankAns[i] === '' || fillInTheBlankAns[i] === undefined){
                            setStatus({ error: true, loading:false, success: false, infoMessage: 'Error: Please enter answer.' })
                            return false
                        }
                        total_score++
                    }
                }

                //push
                data.append('images', null)
                let cd = {
                    "text": '',
                    "correct": fillInTheBlankAns.join(','),
                }
                data.append('choices_list', JSON.stringify(cd))
            }else{
                let hasCorrect = false
                let emptyField = false
                option.value.forEach((c, i) => {
                    //validate
                    if(!c.text) emptyField = true
                    if(c.isAnswer){
                        hasCorrect = true
                        total_score++
                    }

                    //push
                    if(c.image)
                        data.append('images', c.image, i + 1)
                    else
                        data.append('images', null)

                    let cd = {
                        "text": c.text,
                        "correct": c.isAnswer ? 'true' : 'false',
                    }
                    data.append('choices_list', JSON.stringify(cd))
                })
                if(emptyField){
                    setStatus({ error: true, loading:false, success: false, infoMessage: 'Error: Text Fields cannot be empty.' })
                    return
                }
                if(!hasCorrect){
                    setStatus({ error: true, loading:false, success: false, infoMessage: 'Error: Please enter answer.' })
                    return
                }
            }
            total_score *= score
            data.append('current_score', total_score)

            if(!manualReset)
                reset()
            setStatus({ error: false, loading: true, success: false, infoMessage: 'Saving...' })
            await AxiosInstance.post(`school/exam/subject/${routerId}/questions/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((_r) => {
                    setStatus({
                        error: false, loading:false, success: true, infoMessage: 'Saved.' })
                    mutate({ ...subjectQuestions, current_score: subjectQuestions.subject_questions.current_score + total_score })
                }).catch((_e) => {
                    setStatus({ error: true, loading:false, success: false, infoMessage: 'Failed to saved question.' })
                })
        }catch(_e){

        }
    }

    function onChangeImageQuestion(e){
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            if(file){
                setQuestion({
                    ...question,
                    image: e.target.files[0],
                    imagePreview: URL.createObjectURL(file)
                })
            }
        }
    }

    function removeQuestionImage(){
        setQuestion({
            ...question,
            image: null,
            imagePreview: null,
        })
    }

    function onChangeScore(e){
        setScore(e.target.value)
    }

    function onChangeQuestion(e){
        setQuestion({ ...question, text: e.target.value })
    }

    return (
        <>
            <>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                }}>
                    <Box sx={{ width: '800px', display:'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={manualReset}
                            onClick={() => setManualReset(!manualReset)}
                            size="small"/> Manual Reset Form
                    </Box>
                </Box>
                <QuestionContainer>
                    <PointsTextField
                        value={score}
                        onChange={onChangeScore}/>
                    <QuestionTextField
                        onChangeImageQuestion={onChangeImageQuestion}
                        value={question.text}
                        onChange={onChangeQuestion}
                    />
                    <ImagePreview
                        image={question.imagePreview ? question.imagePreview : question.image}
                        onClick={removeQuestionImage}
                    />
                    <TypeSelectField
                        value={type}
                        onChange={onChangeTypeSelect}
                    />
                    {type === questionType.FillInTheBlank && (
                        <>
                            <Box mt={1}>
                                <Typography variant="caption">
                                    Please add underscore _ for answers
                                </Typography>
                            </Box>
                            <Box mt={1}>
                                <FillInTheBlank
                                    question={question.text}
                                    onChange={onChangeFillInTheBlanks}
                                    ans={fillInTheBlankAns}
                                />
                            </Box>
                        </>
                    )}
                    {(type === questionType.CheckBox || type === questionType.MultipleChoice
                        || type === questionType.TrueOrFalse) && (
                        <Box mt={2}>
                            <Typography variant="body2">
                                Choices
                            </Typography>
                            {option?.value?.map((o, i) => (
                                <Box key={i} sx={{ display: 'unset' }}>
                                    <Grid
                                        container
                                        alignItems="center"
                                        sx={{ mt: 1 }}>
                                        <Grid item xs={1}>
                                            {(type === questionType.MultipleChoice || type === questionType.TrueOrFalse) && (
                                                <Radio
                                                    checked={o.isAnswer}
                                                    onChange={(_e) => handleAnswerChange(i)}
                                                />
                                            )}
                                            {type === questionType.CheckBox && (
                                                <Checkbox
                                                    checked={o.isAnswer}
                                                    onChange={(_e) => handleAnswerChange(i, true)}
                                                />
                                            )}
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField
                                                value={o.text}
                                                onChange={(e) => onChangeOption(e, i)}
                                                variant="standard"
                                                fullWidth
                                                autoComplete="off"
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <input
                                                style={{ display: "none" }}
                                                id={`new-question-option-image-${i}`}
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                onChange={(e) => onChangeImageOption(e, i)}
                                                onClick={(e) => {e.target.value = ''}}
                                            />
                                            <label htmlFor={`new-question-option-image-${i}`}>
                                                <IconButton
                                                    component="span"
                                                >
                                                    <CropOriginalIcon/>
                                                </IconButton>
                                            </label>
                                        </Grid>
                                        <Grid item xs={1}
                                        >
                                            {option?.value.length > 1 && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        let newOption = option.value.filter((_disable, j) => {
                                                            return j !== i
                                                        })
                                                        setOption({ value: newOption })
                                                    }}>
                                                    <CancelIcon />
                                                </IconButton>)
                                            }
                                        </Grid>
                                    </Grid>
                                    <ImagePreview
                                        id={i}
                                        image={o.imagePreview ? o.imagePreview : null}
                                        onClick={removeImageFromOption}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                    {type !== questionType.FillInTheBlank && (
                        <Grid container sx={{ mt: 1 }}>
                            <Grid item xs={1}/>
                            <Grid item xs={11}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setOption({ value: [...option.value,
                                            { text: '', image: null, imagePreview: null, isAnswer: false }] })}
                                    disabled={option.value.length >= 5}>
                                    New Option
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            mt: 3,
                        }}
                    >
                        {manualReset && (
                            <Button
                                variant="outlined"
                                color="error"
                                endIcon={(<CancelIcon fontSize="small" />)}
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={reset}
                            >
                                Reset
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            endIcon={(<SaveIcon fontSize="small" />)}
                            sx={{ ml: 1 }}
                            onClick={handleOnSave}
                        >
                            Save
                        </Button>
                    </Box>
                </QuestionContainer>
            </>
        </>
    )
}

export default NewQuestionUI
