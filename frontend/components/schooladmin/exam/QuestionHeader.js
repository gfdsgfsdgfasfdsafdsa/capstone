import {
    Box,
    Typography,
    CircularProgress, Card, CardContent,
    Link as MuiLink, Checkbox, IconButton,
    Tooltip,
} from '@mui/material';
import Link from 'next/link'
import {
    Delete as DeleteIcon,
    Cancel as CancelIcon,
    Check as CheckIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../utils/axiosInstance";
import {useCallback, useState} from "react";

const QuestionHeader = ({ questionCount, status, setStatus, totalQuestion, id, update = true,
                            checked, setChecked, mutate, hideChoices, setHideChoices, subjectQuestions }) => {
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleDelete = async () => {
        setStatus({ error: false, loading: true, success: false, infoMessage: 'Deleting...' })
        let bak = [...checked]
        setChecked([])
        await axiosInstance.post(`/school/exam/subject/questions/${id}/`, { checked }
        ).then(({ data }) => {
            if(data?.error){
                setChecked(bak)
                setStatus({ error: true, loading:false, success: false, infoMessage: 'Failed to delete question.' })
            }else{
                setStatus({
                    error: false, loading:false, success: true, infoMessage: `${bak.length} Deleted.` })
                mutate({
                    ...subjectQuestions,
                    questions: subjectQuestions?.questions?.filter(item => !bak.includes(item.id)).questions,
                    current_score: subjectQuestions.subject_questions.current_score - (bak.length - 1)
                })
            }
        }).catch((_e) => {
            setChecked(bak)
            setStatus({ error: true, loading:false, success: false, infoMessage: 'Failed to delete question.' })
        })
        setConfirmDelete(false)
    }

    const cancelChecked = () => {
        for(let i = 0; i < checked.length; i++){
            document.getElementById(`checkbox-question-${checked[i]}`).click();
        }
        setChecked([])
        setStatus({ error: false, loading:false, success: false, infoMessage: '' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    return (
        <Card sx={{
            position: 'sticky',
            top: '60px',
            zIndex: 100,
        }}>
            <CardContent sx={{
                paddingTop: 2,
                "&:last-child": {
                    paddingBottom: 2
                },
            }}>
                <Box>
                    {questionCount > totalQuestion && (
                        <Typography
                            sx={{ mr: 1, lineHeight: 1.75 }}
                            variant="caption"
                            color="error"
                        >
                            Warning: Score Limit Exceeded.
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems:'center', flexWrap: 'wrap'  }}>
                    <Typography
                        sx={{ mr: 1, lineHeight: 1.75 }}
                        variant="body1"
                    >
                        {questionCount || questionCount === 0 ?
                            `Score Count: ${questionCount}/${totalQuestion}` : null
                        }
                    </Typography>
                    {update && (
                        <>
                            <Box>
                                <Typography component="div" variant="subtitle1"
                                            sx={{ display: 'flex', alignItems:'center', fontSize: '.9rem' }}>
                                    <Checkbox checked={hideChoices} onClick={() => setHideChoices(!hideChoices)} size="small"/> Hide Choices
                                </Typography>
                            </Box>
                            <Box ml={1}>
                            </Box>
                            {checked.length >= 1 && (
                                <Box ml={1}>
                                    <Tooltip title="Cancel Selected" placement="bottom">
                                        <IconButton onClick={cancelChecked}>
                                            <CancelIcon sx={{ fontSize: '22px' }} color="error"/>
                                        </IconButton>
                                    </Tooltip>
                                    {confirmDelete ? (
                                        <Tooltip title="Confirm Delete" placement="bottom">
                                            <IconButton onClick={() => handleDelete()}>
                                                <CheckIcon sx={{ fontSize: '22px' }} color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                    ):(
                                        <Tooltip title="Delete Checked" placement="bottom">
                                            <IconButton onClick={() => setConfirmDelete(true)}>
                                                <DeleteIcon sx={{ fontSize: '22px' }} color="error"/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                    <Box ml={1}>
                        {status.loading ? (
                            <Typography component="div" variant="subtitle1"
                                        sx={{ display: 'flex', alignItems:'center', fontSize: '.9rem' }}
                            >
                                <CircularProgress size={15}/>&nbsp;
                                {status.infoMessage}
                            </Typography>
                        ):(
                            <>
                                {status.success && (
                                    <Typography component="div" variant="subtitle1"
                                                sx={{ fontSize: '.9rem' }}
                                    >
                                        {status.infoMessage}
                                    </Typography>
                                )}
                                {status.error && (
                                    <Typography component="div" color="red" variant="subtitle1"
                                                sx={{ fontSize: '.9rem' }}
                                    >
                                        {status.infoMessage}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
                <Box id="q-header-link">
                    {id && (
                        <>
                            <Link href={`/s/exam/${id}/modify`} passHref>
                                <MuiLink
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mr: 1,
                                        width: '100%',

                                    }}
                                >
                                    List/Update
                                </MuiLink>
                            </Link>
                            <Link href={`/s/exam/${id}/new`} passHref>
                                <MuiLink
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mr: 1,
                                        width: '100%',

                                    }}
                                >
                                    New Question
                                </MuiLink>
                            </Link>
                            <Link href={`/s/exam/${id}/import`} passHref>
                                <MuiLink
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mr: 1,
                                        width: '100%',

                                    }}
                                >
                                    Import
                                </MuiLink>
                            </Link>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default QuestionHeader
