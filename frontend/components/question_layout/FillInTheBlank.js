import {Box, TextField, Typography} from "@mui/material";
import QuestionText from "./QuestionText";
import React, {memo} from "react";

function FillInTheBlank({ question, onChange, questionIndex, image, choice, id }){
    return (
        <Box sx={{ display: !image ? 'flex' : 'unset' }}>
            {!image && (
                <Typography component="span" sx={{ mr: 2, lineHeight: '50px' }}>
                    {questionIndex + 1}.
                </Typography>
            )}
            {image && (
                <QuestionText
                    no={questionIndex+1}
                    image={image}
                />
            )}
            <Typography
                component="div"
                variant="subtitle2"
                sx={{ whiteSpace: 'pre-wrap', marginLeft: image ? '27px' : '1px' }}
            >
                {question?.split('_').map((text, i) => {
                    let value = false
                    if(choice)
                        value = choice.split(',')[i - 1]
                    return (
                        <Typography key={i} component="span" variant="body1">
                            {(i >= 1 ? (
                                <>
                                    <TextField
                                        sx={{
                                            mt: 1,
                                            width: '110px',
                                            '& .MuiOutlinedInput-input': {
                                                padding: '6px'
                                            }
                                        }}
                                        value={value ? value: ''}
                                        onChange={(e) => onChange(e, questionIndex, i-1, id)}
                                        autoComplete="off"/>
                                    <Typography component="span" sx={{ lineHeight: "50px" }}>
                                        {text}
                                    </Typography>
                                </>
                            ) : (
                                <Typography component="span" sx={{ lineHeight: "40px" }}>
                                    {text}
                                </Typography>
                            ))}
                        </Typography>
                    )
                })}
            </Typography>
        </Box>
    )
}

export default memo(FillInTheBlank)