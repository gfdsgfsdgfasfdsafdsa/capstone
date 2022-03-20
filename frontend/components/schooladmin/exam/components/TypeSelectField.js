import {Box, MenuItem, Select, TextField} from "@mui/material";
import questionType from "../../../../libs/questionType";
import {memo} from "react";

const TypeSelectField = (props) => {

    const { value, onChange, questionIndex, qId } = props

    return(
        <Box sx={{ mt: 1 }}>
            <Select
                color="primary"
                sx={{
                    width: '300px',

                    height: '38px',
                }}
                value={value}
                onChange={(e) => onChange(e, qId)}
            >
                <MenuItem
                    value={questionType.MultipleChoice}
                >
                    Multiple Choice
                </MenuItem>
                <MenuItem value={questionType.CheckBox}>
                    CheckBox
                </MenuItem>
                <MenuItem value={questionType.FillInTheBlank}>
                    Fill in The Blank
                </MenuItem>
                <MenuItem value={questionType.Rating}>
                    Rating
                </MenuItem>
                {/*
                <option value={questionType.MultipleChoice}>
                    Multiple Choice
                </option>
                <option value={questionType.TrueOrFalse}>
                    True or False
                </option>
                <option value={questionType.CheckBox}>
                    CheckBox
                </option>
                <option value={questionType.FillInTheBlank}>
                    Fill in The Blank
                </option>
                */}
            </Select>
        </Box>
    )
}

export default memo(TypeSelectField)