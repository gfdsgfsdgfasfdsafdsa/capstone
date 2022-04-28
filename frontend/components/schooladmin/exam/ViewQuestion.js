import {
    Box,
    Typography,
    TextField,
    Radio,
    Checkbox,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormGroup,
    CardContent,
    Card
} from '@mui/material';
import questionType from '../../../libs/questionType'
import QuestionText from "../../question_layout/QuestionText";
import ImageView from "../../question_layout/ImageView";
import rawHTML from "../../../libs/rawHTML";

const defaultDisplay = (q, qI, hideChoices = false) => {
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
                        sx={{ml: 3, marginTop: '3px'}}>
                        {q.choices.map((c) => {
                            return (
                                <Box key={c.id}>
                                    <FormControlLabel
                                        value={c.id}
                                        control={<Radio size="small"/>}
                                        checked={c.correct === 'true'}
                                        label={rawHTML(c.text)}/>
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
                    q.choices.map((c) => {
                        if(c.correct === 'true')
                            scoreCnt += q.score
                        return(
                            <Box key={c.id}>
                                <FormControlLabel
                                    sx={{ ml: 2}}
                                    control={<Checkbox size="small"/>}
                                    checked={c.correct === 'true'}
                                    label={rawHTML(c.text)}
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
                <Box sx={{ display: !hasImage ? 'flex' : 'unset' }}>
                    {!hasImage && (
                        <Typography component="span" sx={{ mr: 2, lineHeight: '50px' }}>
                            {qI + 1}.
                        </Typography>
                    )}
                    {hasImage && (
                        <QuestionText
                            no={qI+1}
                            image={q.imagePreview ? q.imagePreview : q.image}
                        />
                    )}
                    <Typography
                        component="div"
                        variant="subtitle2"
                        sx={{ whiteSpace: 'pre-wrap', marginLeft: hasImage ? '27px' : '1px' }}
                    >
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
                                            <Typography component="span" sx={{ lineHeight: "50px" }}>
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
                </Box>
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

export default function ViewQuestion({ questions, hideChoices }){

    return (
        <Box sx={{ mb: 10 }}>
            {questions?.map((q, i) => {
                return(
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} key={i}>
                        <Card sx={{ width: '800px' }}>
                            <CardContent>
                                {defaultDisplay(q, i, hideChoices)}
                            </CardContent>
                        </Card>
                    </Box>
                )
            })}
        </Box>
    )
}
