import { Card, Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link'
import { Favorite as FavIcon } from '@mui/icons-material';

const Survey = ({ additionalMessage }) => {

    return(
        <>
            <Card sx={{ padding: '20px' }}>
                <Typography>
                    {additionalMessage ? 'If you are finish with the exam. ' : ''}
                    Please answer our survey questionnaire for our capstone. Much appreciated &nbsp;
                    <FavIcon sx={{size:"small",
                            fontSize:"small",
                            color:"primary",
                            variant:"outlined"}} />
                </Typography>
                <Box>
                    <Link href="https://forms.gle/VrBW6QyoYYjV32hg8" passHref>
                        <a target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'blue'}}>
                            https://forms.gle/VrBW6QyoYYjV32hg8
                        </a>
                    </Link>
                </Box>
            </Card>
        </>
    )
}

export default Survey
