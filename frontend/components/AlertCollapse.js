import {
    Alert as MuiAlert, Box, CircularProgress, Collapse, IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const AlertCollapse = ({ condition, text, onClick, severity="success"}) => {

    return condition && (
        <>
            {severity === 'loading' ? (
                <MuiAlert
                    severity="info"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={18}/>
                        &nbsp;&nbsp;
                        {text}
                    </Box>
                </MuiAlert>
            ):(
                <Collapse in={condition}>
                    <MuiAlert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={onClick}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity={severity}
                    >
                        {text}
                    </MuiAlert>
                </Collapse>
            )}
        </>
    )
}

export default AlertCollapse
