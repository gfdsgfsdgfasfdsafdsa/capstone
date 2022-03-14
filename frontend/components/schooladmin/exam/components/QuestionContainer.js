import {Box, Card, CardContent, CardHeader} from "@mui/material";

export default function QuestionContainer({ children }){
    return(
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
            <Card
                className="left-border"
                sx={{
                    width: '800px',
                    paddingLeft: '25px',
                    paddingRight: '25px',
                }}>
                {/*
                    <CardHeader title="New Question" sx={{ padding: '10px 10px', pt: 3 }}/>
                */}
                <CardContent sx={{ padding: '15px 10px', pt:5 }}>
                    {children}
                </CardContent>
            </Card>
        </Box>
    )
}