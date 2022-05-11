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


const SubjectName = memo(function SubjectName({ name }) {
    return (
        <Typography variant="h6">
            {name}
        </Typography>
    )
})

const ExamHeader = ({ schoolName, subject, hours, minutes, seconds, videoPreview, videoEnabled }) => {

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
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
                    <Box>
                        <SchoolName name={schoolName}/>
                        <SubjectName name={subject}/>
                        <Typography variant="cool">
                            Remaining Time {hours}:{minutes}:{seconds}
                        </Typography>
                    </Box>
                </Box>
                {videoEnabled && (
                    <Box>
                        <video
                            ref={videoPreview}
                            style={{
                                border: '2px solid #5048E5',
                                width: '6.6rem',
                                height: '5rem',
                                backgroundColor: 'transparent',
                            }}
                            playsInline={true}
                            autoPlay={true}
                            muted={true}
                        />
                    </Box>
                )}
            </Box>
        </>
    )
}

export default memo(ExamHeader)
