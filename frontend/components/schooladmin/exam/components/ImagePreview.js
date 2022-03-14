import {Box, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {memo} from "react";

function ImagePreview(props){

    const { image, onClick, id } = props
    //onClick for remove image

    return (
        <Box>
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
                        onClick={(e) => onClick(e, id)}
                        component="button"
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Box>
            )}
        </Box>
    )
}

export default memo(ImagePreview)