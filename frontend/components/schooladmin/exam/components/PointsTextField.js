import {
    TextField,
    Typography
} from "@mui/material";
import {memo} from "react";

function PointsTextField(props){
    const { value, onChange, id } = props

    return(
        <Typography component="span" variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            Points
            <TextField
                type="number"
                sx={{
                    width: '40px', ml: 1,
                    '& .MuiOutlinedInput-input': {
                        padding: '6px'
                    }
                }}
                value={value}
                autoComplete="off"
                onChange={(e) => onChange(e, id)}
            />
        </Typography>
    )
}

export default memo(PointsTextField)