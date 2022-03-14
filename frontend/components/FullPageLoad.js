import {
    Box,
    CircularProgress,
    Typography,
} from '@mui/material'

const FullPageLoad = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                backgroundColor: 'background',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: '-80px'
            }}>
            <Typography
                color="info"
                variant="h3"
                sx={{
                    marginBottom: '70px'
                }}
            >
                Loading...
            </Typography>
            <CircularProgress
                size={100}
                color="info"
            />
        </Box>
    )
}

export default FullPageLoad
