import {Grid, TextField, IconButton} from "@mui/material";
import {
    CropOriginal as CropOriginalIcon,
} from '@mui/icons-material'
import { memo } from "react";

const QuestionTextField = (props) => {

    const { value, onChangeImageQuestion, onChange, id, questionIndex } = props

    return (
        <>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={11}>
                    <TextField
                        size="small"
                        sx={{ width: '100%' }}
                        variant="filled"
                        value={value}
                        onChange={(e) => onChange(e, id)}
                        autoComplete="off"
                        multiline={true}
                    />
                </Grid>
                <Grid item xs={1}>
                    <input
                        style={{ display: "none" }}
                        id={`select-file-image-${id}`}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => onChangeImageQuestion(e, id)}
                        onClick={(e) => {e.target.value = ''}}
                    />
                    <label htmlFor={`select-file-image-${id}`}>
                        <IconButton
                            component="span"
                        >
                            <CropOriginalIcon/>
                        </IconButton>
                    </label>
                </Grid>
            </Grid>
        </>
    )
}

export default memo(QuestionTextField)