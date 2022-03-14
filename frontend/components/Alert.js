import {
    Alert as MuiAlert
} from "@mui/material";

const Alert = ({ condition, text="", severity="success"}) => (
    condition && (
        <MuiAlert severity={severity}>{text}</MuiAlert>
    )
)

export default Alert