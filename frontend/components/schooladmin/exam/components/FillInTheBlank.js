import {memo} from "react";
import {Box, TextField, Typography} from "@mui/material";

function FillInTheBlank({ question, onChange, qId, choice }){

    return (
        <Box>
            <Box mt={1}>
                <Typography variant="caption">
                    Please add underscore _ for answers
                </Typography>
            </Box>
            <Box mt={1}>
                <Typography
                    component="div"
                    variant="subtitle2"
                    sx={{ whiteSpace: 'pre-wrap' }}
                >
                    {question?.split('_').map((qq, i) => {
                        let value = choice.split(',')[i - 1]
                        return (
                            <Typography key={i} variant="div">
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
                                            value={value !== undefined ? value : ''}
                                            inputProps={{ 'data-id': qId }}
                                            onChange={(e) => onChange(e, i, qId)}
                                            autoComplete="off"
                                        />
                                        <Typography component="span" sx={{ lineHeight: "50px" }}>
                                            {qq}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography component="span" sx={{ lineHeight: "40px" }}>{qq}</Typography>
                                )}
                            </Typography>
                        );
                    })}
                </Typography>
            </Box>
        </Box>
    )
}

export default memo(FillInTheBlank)
