import {Box, Typography} from "@mui/material";
import {memo} from "react";
import rawHTML from "../../libs/rawHTML";

function QuestionText({ question, no, image }){

    return(
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                    {no}.
                </Typography>
                <Typography variant="body1" className="new-line">
                    {rawHTML(question)}
                </Typography>
            </Box>
            <Box mb={1}>
                {image && (
                    <Box component="img"
                         src={image}
                         alt="image preview"
                         sx={{
                             px: 5,
                             mt: 2,
                             height: 'auto',
                             maxWidth: '700px',
                             //width: '100%'
                         }}
                    />
                )}
            </Box>
        </Box>
    )
}

export default memo(QuestionText)