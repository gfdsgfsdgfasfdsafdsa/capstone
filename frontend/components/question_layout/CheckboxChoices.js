import {memo} from "react";
import {Checkbox, FormControlLabel, Radio} from "@mui/material";
import rawHTML from "../../libs/rawHTML";

function CheckboxChoices(props){

    const { disable, checked, onClick, question, questionIndex, choiceIndex, id, choiceId } = props

    return (
        <>
            <FormControlLabel
                sx={{ ml: 2}}
                control={<Checkbox
                    size="small"
                    checked={checked}
                    disabled={disable}
                    onClick={(e) => onClick(e, questionIndex, choiceIndex, id, choiceId)}
                />}
                label={rawHTML((question))}
            />
        </>
    )
}

export default memo(CheckboxChoices)
