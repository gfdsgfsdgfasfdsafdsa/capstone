import {Box} from "@mui/material";
import {memo} from "react";

function ImageView({ image }){
    return (
        <>
            {image && (
                <Box>
                    <Box component="img"
                         src={image}
                         alt="image preview"
                         sx={{
                             px: 5,
                             height: 'auto',
                             maxWidth: '700px',
                             width: '100%'
                         }}
                    />
                </Box>
            )}
        </>
    )
}

export default memo(ImageView)