import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
    Link as MuiLink
} from '@mui/material';
import Link from 'next/link'

const SubjectCard = ({ subject, published }) => {

    return(
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <CardContent>
                <Typography
                    align="center"
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                >
                    {subject?.name}
                </Typography>
                <Typography
                    align="center"
                    color="textPrimary"
                    variant="body1"
                >
                    <Typography
                        color={subject?.current_score !== subject?.total_questions ? 'error' : 'black'} component="span"
                    >{subject?.current_score ? subject?.current_score : 0}</Typography>
                    /{subject?.total_questions} score
                </Typography>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            {published ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Link href={`/s/exam/${subject?.id}/list`} passHref>
                        <MuiLink
                            variant="contained"
                            color="primary"
                            sx={{
                                mr: 1,
                                width: '100%',

                            }}
                        >
                            View Questions
                        </MuiLink>
                    </Link>
                </Box>
            ):(
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Link href={`/s/exam/${subject?.id}/new`} passHref>
                        <MuiLink
                            variant="contained"
                            color="primary"
                            sx={{
                                mr: 1,
                                width: '100%',

                            }}
                        >
                            Set Questions
                        </MuiLink>
                    </Link>
                </Box>
            )}
        </Card>
    )
}


export default SubjectCard
