import {memo} from "react";
import {FormControlLabel, Radio} from "@mui/material";

function MultipleChoices(props){

    const { onClick, choiceIndex, questionIndex, questionId, choiceId, answer, text } = props

    return (
        <>
            <FormControlLabel
                value={choiceId}
                control={<Radio size="small"/>}
                checked={answer}
                onClick={() => onClick(questionIndex, choiceIndex, questionId, choiceId)}
                label={text}/>
        </>
    )
}

export default memo(MultipleChoices)
