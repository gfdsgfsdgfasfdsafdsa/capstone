import {Box, LinearProgress, Typography} from "@mui/material";

export default function Loading({ text = 'Loading...' }){
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '200px',
        }}>
            <Typography variant="h6" mb={2}>
                {text}
            </Typography>
            <LinearProgress sx={{ width:'400px' }}/>
        </Box>
    )
}