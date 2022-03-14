import {memo} from "react";
import {
    Box,
    TextField,
    Typography,
    Grid,
    Radio,
    Checkbox,
    IconButton,
} from "@mui/material";
import {
    CropOriginal as CropOriginalIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material'
import questionType from "../../../../libs/questionType";

function ChoiceOption(props){

    const { text, onChangeAnswer, onChange, type, onChangeImageOption, onClickRemoveOption, onClickRemoveOptionImage, image,
        questionIndex, choiceIndex, displayCloseButton, correct, qId, cId } = props
    //onClick for remove image

    return (
        <>
            <Grid
                container
                sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
            >
                <Grid item xs={1}>
                    {questionType[type] === questionType.MultipleChoice || questionType[type]
                    === questionType.TrueOrFalse ?
                        <Radio
                            checked={correct === 'true'}
                            onChange={() => onChangeAnswer(qId, choiceIndex)}
                        />
                        :
                        <Checkbox
                            checked={correct === 'true'}
                            onChange={() => onChangeAnswer(qId, choiceIndex, true)}
                        />}
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        value={text}
                        variant="standard"
                        fullWidth
                        autoComplete="off"
                        onChange={(e) => onChange(e, qId, choiceIndex)}
                    />
                </Grid>
                <Grid item xs={1}>
                    <input
                        style={{ display: "none" }}
                        id={`option-image-${qId}-${choiceIndex}`}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => onChangeImageOption(e, qId, choiceIndex)}
                        onClick={(e) => {e.target.value = ''}}
                    />
                    <label htmlFor={`option-image-${qId}-${choiceIndex}`}>
                        <IconButton
                            component="span"
                        >
                            <CropOriginalIcon/>
                        </IconButton>
                    </label>
                </Grid>
                <Grid item xs={1}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    {displayCloseButton && (
                        <IconButton
                            onClick={() => onClickRemoveOption(qId, choiceIndex)}
                            color="error">
                            <CancelIcon />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
            {image && (
                <Box sx={{ position: 'relative', width: '500px' }}>
                    <Box component="img"
                         src={image}
                         alt="image preview"
                         sx={{
                             px: 5,
                             mt: 2,
                             height: 'auto',
                             width: '100%'
                         }}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute', top: '5px', right: '30px', backgroundColor: '#fff',
                            '&:hover': {
                                backgroundColor: '#dedede'
                            }
                        }}
                        color="error"
                        onClick={() => onClickRemoveOptionImage(qId, choiceIndex)}
                        component="button"
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Box>
            )}
        </>
    )
}

export default memo(ChoiceOption)
