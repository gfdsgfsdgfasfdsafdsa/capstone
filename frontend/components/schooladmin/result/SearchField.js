import {
    Box,
    TextField,
    Typography,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material'

const SearchField = () => {

    return (
        <Box>
            <Box
                sx={{
                    alignItems: 'baseline',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    m: -1,
                    p: 2,
                }}
            >
                <Typography
                    variant="text"
                >
                    Search: 
                </Typography>
                <TextField id="outlined-basic" label="Press enter to search...." variant="outlined" size="small" 
                    sx={{
                        ml:1,
                    }}
                />
            </Box>
        </Box>
    )
}

export default SearchField
