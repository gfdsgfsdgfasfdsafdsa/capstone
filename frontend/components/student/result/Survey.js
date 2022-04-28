import { Card, Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link'
import { Favorite as FavIcon } from '@mui/icons-material';

const Survey = () => {

    return(
        <>
            <Card sx={{ padding: '20px', mt: 2, }}>
                <Typography>
                    Please answer our survey questionnaire. Much appreciated &nbsp;
                    <FavIcon sx={{size:"small",
                            fontSize:"small",
                            color:"primary",
                            variant:"outlined"}} />
                    &nbsp;
                    <Link href="https://forms.gle/VrBW6QyoYYjV32hg8" passHref>
                        <a target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'blue'}}>
                            https://forms.gle/VrBW6QyoYYjV32hg8
                        </a>
                    </Link>
                </Typography>
            </Card>
        </>
    )
}

export default Survey