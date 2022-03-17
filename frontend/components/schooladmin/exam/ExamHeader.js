import {useEffect, useRef, useState} from 'react'
const Papa = require('papaparse');
import AxiosInstance from '../../../utils/axiosInstance'
import  { useSWRConfig } from 'swr'
import {CustomDialog, Alert} from "../../Index";
import {useSnackbar} from "notistack";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Link as MuiLink,
    CircularProgress,
    TextField, Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableContainer, Pagination,
} from '@mui/material';
import {
    Upload as UploadIcon,
    Cancel as CancelIcon,
    Check as CheckIcon,
    InsertDriveFile as InsertDriveFileIcon
} from '@mui/icons-material'
import AlertCollapse from "../../AlertCollapse";
import {paginationRecordCount} from "../../../config/settings";

const ExamHeader = ({ exam, dScrollOpen, setDScrollOpen, csvData, page, setPage }) => {
    const fileInit = {
        name: '',
        file: '',
    }
    //ftop
    const [file, setFile] = useState(fileInit)

    const [status, setStatus] = useState({
        success: false,
        error: false,
        loading: false,
        message: '',
    })

    function onClickCloseAlertCollapse(){
        setStatus({
            success: false,
            error: false,
            loading: false,
            message: '',
        })
    }


    const { mutate } = useSWRConfig()

    const { enqueueSnackbar } = useSnackbar();

    const resetStates = () => {
        setFile(fileInit)
    }

    const onChangeHandleFile = async (e) => {
        resetStates()
        let localFile = ''
        try {
            localFile = e.target.files[0]

            setFile({ ...file,
                name: localFile.name,
                file: localFile,
            })
        } finally {
        }
    }

    /*
    async function papaparse(){
        let data = []
        await Papa.parse(file.file, {
            download: true,
            complete: await function(results) {
                data = results
                //validation
                t = results.data
                results?.data.map((r, i) => {
                    r.map((item, j) => {
                        if(i === 0 && j === 0 && item === 'Course'){
                            hasCourse = true
                        }else if(i === 0 && j === 1 && item === 'Strand'){
                            hasStrand = true
                        }else if(i === 0){
                            try{
                                let subject = item.split('/')
                                if(subject.length === 2 && !isNaN(subject[1])){
                                    limit.push(parseInt(subject[1]))
                                    hasLimit = true
                                }
                            }catch{
                                hasLimit = false
                            }
                        }else{
                            //last item is empty return
                            if(results.data.length - 1 === i) return

                            if(j === 0 || j === 1 && item === '')
                                emptyCell = true
                            else if(!isNaN(item) && item !== ''){
                                if(parseInt(item) > limit[j - 2])
                                    greaterThanLimit = true
                            }
                        }
                    })
                })
            }
        });
        return data
    }
    */
    async function csvFile(){
        return await new Promise((resolve, reject) => {
            try {
                Papa.parse(file.file,
                    {
                        complete: function(r) {
                            resolve(r.data);
                        }
                    }
                )
            }
            catch (e) {
                resolve(false);
            }
        })
    }


    const onClickConfirm = async () => {
        let csvFileData = await csvFile().then((data) => data)
        if(!csvFileData){
            setStatus({
                success: false,
                error: true,
                loading: false,
                message: 'Something is wrong.'
            })
            return
        }

        let hasCourse = false, hasStrand = false, hasOverall = false, hasStudent = false, hasLimit = false, emptyCell = false
        let limit = [], greaterThanLimit = false

        csvFileData.map((r, i) => {
            r.map((item, j) => {
                if(i === 0 && j === 0 && item === 'Student') {
                    hasStudent = true
                }else if(i === 0 && j === 1 && item === 'Course'){
                    hasCourse = true
                }else if(i === 0 && j === 2 && item === 'Strand'){
                    hasStrand = true
                }else if(i === 0){
                    try{
                        if(item === 'Overall'){
                            hasOverall = true
                            return
                        }
                        let subject = item.split('/')
                        if(subject.length === 2 && !isNaN(subject[1]) && subject[1] !== ''){
                            limit.push(parseInt(subject[1]))
                            hasLimit = true
                        }else{
                            hasLimit = false
                        }
                    }catch{
                        hasLimit = false
                    }
                }else{
                    //last item is empty return
                    if(csvFileData?.length - 1 === i) return

                    if((j === 0 || j === 1 || j === 2) && item === ''){
                        emptyCell = true
                    }else if(!isNaN(item) && item !== ''){
                        if(parseInt(item) > limit[j - 3])
                            greaterThanLimit = true
                    }
                }
            })
        })

        if(!hasCourse){
            setStatus({ success: false, error: true, loading: false, message: 'No column named "Course" found.' })
            setFile({ ...file, name: '' })
            return
        }else if(!hasStrand){
            setStatus({ success: false, error: true, loading: false, message: 'No column named "Strand" found.' })
            setFile({ ...file, name: '' })
            return
        }else if(!hasStudent){
            setStatus({ success: false, error: true, loading: false, message: 'No column named "Student" found.' })
            setFile({ ...file, name: '' })
            return
        }else if(emptyCell){
            setStatus({ success: false, error: true, loading: false, message: 'Cell cannot be empty.' })
            setFile({ ...file, name: '' })
            return
        }else if(!hasOverall){
            setStatus({ success: false, error: true, loading: false, message: 'No column named "Overall" found.' })
            setFile({ ...file, name: '' })
            return
        }else if(!hasLimit){
            setStatus({ success: false, error: true, loading: false, message: 'Please add question limit Subject/No of items.' })
            setFile({ ...file, name: '' })
            return
        }

        setStatus({
            success: false,
            error: false,
            loading: true,
            message: 'Uploading CSV FILE'
        })

        try{
            let form_data = new FormData();
            form_data.append('csv_file', file.file)
            setFile({
                ...file,
                name: ''
            })
            await AxiosInstance.put(`school/exam/${exam.id}/`, form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((_r) => {
                mutate('school/exam/')
                /*
                enqueueSnackbar('File has been uploaded successfully.', { variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                });
                */
                setFile({
                    ...file,
                    name: ''
                })
                setStatus({
                    success: true,
                    error: false,
                    loading: false,
                    message: 'File has been uploaded successfully.'
                })
            }).catch((_e) => {
                /*
                enqueueSnackbar('File upload failed.', { variant: 'danger',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                });
                */
                setStatus({
                    success: false,
                    error: true,
                    loading: false,
                    message: 'File upload failed.'
                })
                setFile({ ...file,
                    error: 'Failed to upload file.',
                    success: false,
                    name: '',
                })
            })
        }catch (_e){
            setFile({ ...file,
                error: 'Failed to upload file.',
                success: false,
                name: '',
            })
        }
    }

    /*
    const getCSVName = (s) => {
        if(s === null || s === undefined) return
        const arr = s.split('/')
        return arr[arr.length - 1]
    }
     */
    const time_limit = exam?.time_limit !== null ? exam?.time_limit?.split(':') : []
    const [hour, setHour] = useState(time_limit[0])
    const [minute, setMinute] = useState(time_limit[1])

    const nParse = (n) => {
        let num = parseInt(n)
        if(num < 10) return `0${num.toString()}`
        return num.toString()
    }

    const onChangeHour = (e) => {
        const n = e.target.value
        if(isNaN(n) || n === '') return
        if(parseInt(n) >= 24){
            setHour('24')
            setMinute('00')
        }else{
            setHour(nParse(n))
        }
    }

    const onChangeMin = (e) => {
        const n = e.target.value
        if(isNaN(n) || n === '') return
        if(parseInt(hour) === 24){
            setMinute('00')
        }else if(parseInt(n) > 60){
            setMinute('60')
        }else{
            setMinute(nParse(n))
        }
    }

    const onClickSetTimeLimit = async () => {
        resetStates()
        setStatus({
            success: false,
            error: false,
            loading: true,
            message: 'Setting time.'
        })

        const data = new FormData()
        data.append('time_limit', `${hour}:${minute}`)

        await AxiosInstance.put(`school/exam/${exam.id}/`, data)
            .then((_r) => {
                mutate('school/exam/', { ...exam, time_limit: `${hour}:${minute}` }, false)
                setStatus({
                    success: true,
                    error: false,
                    loading: false,
                    message: 'Time has been set.'
                })
            }).catch((_e) => {
                setStatus({
                    success: false,
                    error: true,
                    loading: false,
                    message: 'Unable to set time please try again.'
                })
            })
    }

    //Dialog
    //Publish Exam
    const [openDialog, setOpenDialog] = useState(false)

    const onClickPublish = async () => {
        setOpenDialog(false)

        if(exam?.is_published){
            setStatus({
                success: false,
                error: false,
                loading: true,
                message: 'Unublishing...'
            })
        }else{
            setStatus({
                success: false,
                error: false,
                loading: true,
                message: 'Publishing...'
            })
        }
        if(exam?.time_limit === "00:00"){
            setStatus({
                success: false,
                error: true,
                loading: false,
                message: 'Please set time limit.'
            })
            return
        }
        if(!exam?.is_published){
            let notEqual = false
            exam?.exam_subjects.map((s) => {
                if(s.current_score !== s.total_questions){
                    notEqual = true
                }
            })
            if(notEqual){
                setStatus({
                    success: false,
                    error: true,
                    loading: false,
                    message: 'Score must be equal.'
                })
                return
            }
        }

        resetStates()
        const data = new FormData()
        data.append('is_published', !exam.is_published)
        await AxiosInstance.put(`school/exam/${exam.id}/`, data)
            .then((_r) => {
                mutate('school/exam/', { ...exam, is_published: !exam.is_published }, false)
                if(!exam?.is_published){
                    setStatus({
                        success: true,
                        error: false,
                        loading: false,
                        message: 'Exam has been published.'
                    })
                }else{
                    setStatus({
                        success: true,
                        error: false,
                        loading: false,
                        message: 'Exam has been unpublished.'
                    })
                }
            }).catch((_e) => {
                setStatus({
                    success: false,
                    error: true,
                    loading: false,
                    message: 'Failed to do action'
                })
            })
    }

    // Dialog Scroll
    const handleClickScrollOpen = () => {
        setDScrollOpen(true);
    };

    const handleScrollClose = () => {
        setDScrollOpen(false);
    };


    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (dScrollOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dScrollOpen]);

    return (
        <Box>
            <Dialog
                open={dScrollOpen}
                onClose={handleScrollClose}
                scroll="paper"
                maxWidth="md"
                TransitionProps={{ timeout: 0, enter: false }}
            >
                <DialogTitle id="scroll-dialog-title">
                    {csvData?.status === '204' ? 'No CSV File uploaded.' : (
                        csvData !== undefined ?
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="cool">CSV File</Typography>
                                <MuiLink
                                    href={`${process.env.api}${exam?.csv_file}`}
                                    target="_blank"
                                    color="primary"
                                    sx={{ textTransform: 'none', fontSize: '14px' }}
                                    variant="outlined"
                                >
                                    Download File
                                </MuiLink>
                            </Box>
                            :
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={15} sx={{ mr: 2 }}/> Fetching data...
                            </Box>
                    )
                }
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component="div"
                    >
                        <TableContainer>
                            <Table size="small" sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        {csvData?.row_header?.map((r, i) => {
                                            if(i === 0){
                                                return(
                                                    <TableCell key={i}>
                                                        {r}
                                                    </TableCell>
                                                )
                                            }else{
                                                return(
                                                    <TableCell key={i} align="right">
                                                        {r}
                                                    </TableCell>
                                                )
                                            }
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {csvData?.data?.map((r, i) => {
                                        return(
                                            <TableRow key={i}
                                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                {r.map((item, ii) => {
                                                    if(ii === 0){
                                                        return(
                                                            <TableCell key={ii} component="th" scope="row">
                                                                {item}
                                                            </TableCell>
                                                        )
                                                    }else{
                                                        return(
                                                            <TableCell key={ii} align="right">
                                                                {item}
                                                            </TableCell>
                                                        )
                                                    }
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Box
                        my={2}
                        mr={1}
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            rowGap: '10px',
                        }}
                    >
                        <Box sx={{ mr: 1 }}>
                            {paginationRecordCount(page, csvData?.count)}
                        </Box>
                        <Pagination count={csvData?.count ? Math.ceil(csvData?.count/15) : 0}
                                    page={page}
                                    color="primary"
                                    onChange={(_e, n) => {
                                        setPage(n)
                                    }}/>
                    </Box>
                    <Button variant="contained" size="small" onClick={handleScrollClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ mb: 1 }}>
                {exam?.csv_file && file.name !== '' ? (
                    <Alert condition={true}
                           severity="warning"
                           text="The subject that is not included in the csv will be removed." />
                ):(
                    <>
                        <AlertCollapse
                            condition={status.loading}
                            severity="loading"
                            text={status.message}
                            onClick={onClickCloseAlertCollapse}
                        />
                        <AlertCollapse
                            condition={status.error}
                            severity="error"
                            text={status.message}
                            onClick={onClickCloseAlertCollapse}
                        />
                        <AlertCollapse
                            condition={status.success}
                            text={status.message}
                            onClick={onClickCloseAlertCollapse}
                        />
                    </>
                )}
                {/*
                <Alert condition={publish.success && !publish.loading}
                       text={publish.published ? 'Exam has been published.' : 'Exam has been unpublished.'} />


                <Alert condition={file.success}
                       text="File has been uploaded successfully." />
                <Alert condition={file.error !== ''}
                       severity="error"
                       text={file.error} />

                <Alert condition={time.success}
                       text="Time has been successfully set." />
                <Alert condition={time.error}
                       severity="error"
                       text={time.error} />
                */}
            </Box>
            <CustomDialog
                onClickConfirm={onClickPublish}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                title={exam?.is_published ? 'Unpublished Exam' : 'Publish Exam'}
                content={exam?.is_published ? 'Student will no longer able to take exam.' : 'Student will be able to take this exam.'}
            />
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1,
                }}
            >
                <Box sx={{ m: 1, mt:0, display: 'flex', alignItems: 'center' }}>
                    {file.name !== '' ? (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={(<CancelIcon fontSize="small" />)}
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={(_e) => setFile(fileInit)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                component="span"
                                startIcon={(<CheckIcon fontSize="small" />)}
                                sx={{ mr: 1 }}
                                onClick={onClickConfirm}
                            >
                                Confirm
                            </Button>
                        </>
                    ) : (
                        <>
                            {!exam.is_published && (
                                <>
                                    <input
                                        style={{ display: "none" }}
                                        id="contained-button-file"
                                        type="file"
                                        name="csv"
                                        accept=".csv"
                                        onChange={onChangeHandleFile}
                                        onClick={(e) => {e.target.value = ""}}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            component="span"
                                            startIcon={(<UploadIcon fontSize="small" />)}
                                            sx={{ mr: 1 }}
                                            size="small"
                                            disabled={status.loading}
                                        >
                                            {exam?.csv_file ? 'Import New CSV' : 'Import CSV'}
                                        </Button>
                                    </label>
                                </>
                            )}
                        </>
                    )}
                    <>
                        {file.name !== '' ?
                            <Typography
                                variant="overline"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                }}
                            >
                                {file.name}
                            </Typography>
                            :
                            exam.csv_file !== null && (
                                <Button
                                    variant="outlined"
                                    color="info"
                                    startIcon={(<InsertDriveFileIcon fontSize="small" />)}
                                    size="small"
                                    sx={{ mr: 1, mt: exam.is_published ? 1 : 0 }}
                                    disabled={status.loading}
                                    onClick={handleClickScrollOpen}
                                >
                                    {/*
                                        <MuiLink
                                            href={`${process.env.api}${exam?.csv_file}`}
                                            target="_blank"
                                            color="primary"
                                            sx={{ textTransform: 'none', fontSize: '14px' }}
                                            variant="overline"
                                        >
                                            {getCSVName(exam?.csv_file)}
                                        </MuiLink>
                                        */}
                                    View CSV FILE
                                </Button>
                            )
                        }
                    </>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', mr:2,
                    mb: {
                        sm: 0,
                        xs: 2
                    },
                    ml: {
                        sm: 0,
                        xs: 2
                    }
                }}>
                    <Box>
                        {(exam.csv_file !== null) && (
                            <>
                                <Typography variant="overline">
                                    Time format hh/mm
                                </Typography>
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}
                                    component="div"
                                >
                                    {exam.is_published ? (
                                        <Typography>
                                            {hour} hr : {minute} min
                                        </Typography>
                                    ):(
                                        <>
                                            <TextField
                                                inputProps={{style: { textAlign: 'center' }}}
                                                placeholder="hh"
                                                value={hour}
                                                sx={{
                                                    width: '40px',
                                                    '& .MuiOutlinedInput-input': {
                                                        padding: '5px'
                                                    }
                                                }}
                                                disabled={status.loading}
                                                onChange={onChangeHour}
                                            />:
                                            <TextField
                                                inputProps={{style: { textAlign: 'center' }}}
                                                placeholder="mm"
                                                sx={{
                                                    width: '40px', ml: 1,
                                                    '& .MuiOutlinedInput-input': {
                                                        padding: '5px'
                                                    }
                                                }}
                                                disabled={status.loading}
                                                value={minute}
                                                onChange={onChangeMin}
                                            />
                                            <Button variant="outlined"
                                                    sx={{ padding: '4px 20px', ml: 1 }}
                                                    disabled={status.loading}
                                                    onClick={onClickSetTimeLimit}>
                                                Set
                                            </Button>
                                        </>
                                    )}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
            <MuiLink
                href="/static/guide.png"
                target="_blank"
                color="primary"
                variant="overline"
            >
                See how to upload csv correctly
            </MuiLink>
            {exam.csv_file && (
                <Box mt={1}>
                    <Card>
                        <CardContent sx={{
                            "&:last-child": {
                                padding: 1
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center',
                            }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component="span"
                                    onClick={() => setOpenDialog(true)}
                                    sx={{
                                        mr: 1,
                                        padding: '4px 20px',
                                    }}
                                    disabled={status.loading}
                                >
                                    {exam.is_published ? 'Unpublish Exam': 'Publish Exam'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    )
}

export default ExamHeader
