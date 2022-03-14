import {
    Box,
    Typography,
} from '@mui/material'
import {memo} from "react";

const SchoolName = memo(function SchoolName({ name }) {
    return (
        <Typography variant="body2">
            {name}
        </Typography>
    )
})

const ExamHeader = ({ schoolName, subject }) => {

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    position: 'sticky',
                    top: '63px',
                    px: 6,
                    backgroundColor: '#F9FAFC',
                    zIndex: 100,
                }}>
                {/*
                <Box
                    sx={{
                        display: 'flex',
                    }}>
                    <Image
                        src={logoUrl ? logoUrl: "/static/images/hcdc_logo.png"}
                        alt="Picture of the author"
                        width={50}
                        height={50}
                        quality={100}
                        placeholder="blur"
                        blurDataURL={logoUrl ? logoUrl: "/static/images/hcdc_logo.png"}
                    />
                    <Box sx={{ ml: 1, mt: 1 }}>
                        <Typography variant="h6">
                            {schoolName}
                        </Typography>
                    </Box>
                </Box>
                */}
                <Box sx={{ mt: 1 }}>
                    <SchoolName name={schoolName}/>
                    <Typography variant="h6">
                        {subject}
                    </Typography>
                    <Typography variant="cool">
                        Remaining Time 00:00:00
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default memo(ExamHeader)
