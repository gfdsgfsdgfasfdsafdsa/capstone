import {
    Box,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Typography,
    IconButton,
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
} from '@mui/icons-material'

const SearchBar = (props) => {

    const { onChange, onKeyUp, text, setText, placeholder = 'Search and press Enter', hasQuery, push } = props

    return (
        <Box>
            <Box>
                <Card>
                    <CardContent
                        sx={{
                            p: 2,
                            "&:last-child": {
                                paddingBottom: 2,
                            },
                            display: 'flex',
                            flexDirection: {
                                md: 'row',
                                xs: 'column'
                            },
                            justifyContent: {
                                md: 'space-between',
                                xs: 'end',
                            },
                            alignItems: 'center',
                            rowGap: 1
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {text !== '' ? (
                                <>
                                    Results for : {text}
                                    {hasQuery && (
                                        <IconButton
                                            onClick={() => {
                                                setText('')
                                                if(push) push()
                                            }}
                                            sx={{
                                                '& .MuiSvgIcon-root':{
                                                    width: '1.2rem',
                                                    height: '1.2rem',
                                                }
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                    )}
                                </>
                            ) : ''}
                        </Typography>
                        <Box sx={{
                            maxWidth: 500,
                        }}>
                            <TextField
                                sx={{
                                    width: '350px',
                                    '& .MuiOutlinedInput-input': {
                                        padding: '10px',
                                    }
                                }}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                placeholder={placeholder}
                                variant="outlined"
                                autoComplete="off"
                                onChange={onChange}
                                onKeyUp={onKeyUp}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export default SearchBar
