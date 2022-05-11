import {
    Box, Card, CardContent,
    CardHeader, Container, Typography,
    Link as MuiLink, Button, Checkbox, FormControlLabel, LinearProgress,
} from "@mui/material";
import {
    Upload as UploadIcon,
} from '@mui/icons-material'
import AxiosInstance from "../../../utils/axiosInstance";
import {memo, useCallback, useEffect, useState} from 'react'
import rawHTML from "../../../libs/rawHTML";
import Image from 'next/image'

const ImportSettings = memo(function ImportSettings({ onChangeHandleFile }) {

    return (
        <Box>
            <Box>
                <input
                    style={{ display: "none" }}
                    id="contained-button-file"
                    type="file"
                    accept=".txt"
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
                    >
                        Import File
                    </Button>
                </label>
            </Box>
        </Box>
    )
});

const ListDisplay = memo(function ListDisplay({ list }) {

    return (
        <Box>
            {list.map((d, i) => {
                return(
                    <Box key={i} className="new-line">
                        <Box
                            sx={{
                                display: 'flex'
                            }}
                        >
                            <Typography variant="body1" sx={{ mr: 1 }}>
                                {i+1}.
                            </Typography>
                            <Typography variant="body1">
                                {d.question}
                            </Typography>
                        </Box>
                        <Box ml={4} mt={1}>
                            <Typography variant="body2">
                                <span style={{ color: '#031496' }}>Type:</span> {d.type}
                            </Typography>
                            <Typography variant="body2">
                                <span style={{ color: '#031496' }}>Points:</span> {d.points}
                            </Typography>
                            <Box mt={1}>
                                {d.c1 !== '' && (
                                    <Typography variant="body1">
                                        {d.c1}
                                    </Typography>
                                )}
                                {d.c2 !== '' && (
                                    <Typography variant="body1">
                                        {d.c2}
                                    </Typography>
                                )}
                                {d.c3 !== '' && (
                                    <Typography variant="body1">
                                        {rawHTML(d.c3)}
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <span style={{ color: '#031496' }}>Answer:</span> {d.answer}
                            </Typography>
                        </Box>
                        <Box mb={2}/>
                    </Box>
                )
            })}
        </Box>
    )
});

function ImportQuestionUI({ id, mutate }){
    const [importStatus, setImportStatus] = useState({
        error: false,
        success: false,
        info: '',
    })
    const [list, setList] = useState([])
    const [deleteAllQ, setDeleteAllQ] = useState(false)
    const uStatus = {
        loading: false,
        error: false,
        success: false,
        info: '',
    }
    const [uploadStatus, setUploadStatus] = useState(uStatus)

    let obj = {
        'type': '',
        'points': '',
        'question': [],
        'c1': '',
        'c2': '',
        'c3': '',
        'c4': '',
        'c5': '',
        'answer': '',
    }

    function resetObj(){
        obj = {
            'type': '',
            'points': '',
            'question': [],
            'c1': '',
            'c2': '',
            'c3': '',
            'c4': '',
            'c5': '',
            'answer': '',
        }
    }

    function countInstances(string, word) {
        return string.split(word).length - 1;
    }
    console.log(list)

    const onChangeHandleFile = useCallback((e) => {
        setUploadStatus(uStatus)
        setList([])
        try{
            let localFile = e.target.files[0]
            let reader = new FileReader();

            let data = []
            let choice = 1
            let l = '', ans, cn
            let obj_keys = ['Type', 'Points', 'Question', 'Choice1', 'Choice2', 'Choice3', 'Choice4', 'Choice5', 'Answer']
            let ch_keys = ['Choice1', 'Choice2', 'Choice3', 'Choice4', 'Choice5']
            reader.onload = function(progressEvent){

                let line = this.result.split('\n');
                for(let i = 0; i < line.length; i++){
                    if(line[i] === '') continue

                    l = line[i].split(':')
                    if(!obj_keys.includes(l[0])){
                        if(l[0] === '\r') continue

                        obj.question.push(l.join(':').trim())
                    }else if(l[0] === 'Type'){
                        obj.type = l[1].trim()
                        if(obj.type !== 'Multiple' && obj.type !== 'Checkbox' && obj.type !== 'Fillintheblank'){
                            setImportStatus({ error: true, info: 'Question type does not exist.', success: false})
                            return
                        }
                    }else if(l[0] === 'Points'){
                        if(isNaN(l[1].trim())){
                            setImportStatus({ error: true, info: 'Invalid Score.', success: false})
                            return
                        }
                        obj.points = l[1].trim()
                    }else if(l[0] === 'Question'){
                        let que = [...l]
                        que.shift()
                        obj.question = [que.join(':').trim()]
                    }else if(obj.type === 'Multiple' || obj.type === 'Checkbox'){
                        if(l[0] === 'Answer'){
                            ans = l[1].trim()
                            choice = 1
                            obj.answer = ans
                            ans = ans.split(',')
                            for(let a of ans){
                                a = a.trim()
                                if(ch_keys.includes(a)){
                                    cn = a.slice(-1);
                                    if(obj['c'+cn] !== ''){}
                                    else{
                                        setImportStatus({ error: true, info: `Choice${cn} does not exist. In  "${obj.question.join('')}"`, success: false})
                                        return
                                    }
                                }else{
                                    setImportStatus({ error: true, info: `Answer is incorrect. In "${obj.question.join('')}"`, success: false})
                                    return
                                }
                            }
                            obj.question = obj.question.join('\n')
                            data.push(obj)
                            resetObj()
                        }else{
                            if(choice > 5){
                                setImportStatus({ error: true, info: `Invalid Choices. In "${obj.question.join('')}"`, success: false})
                                return
                            }
                            if(l[0] === (`Choice${choice}`)){
                                obj[`c${choice}`] = l[1].trim()
                                choice += 1
                            }
                        }
                    }else if(obj.type === 'Fillintheblank'){
                        if(l[0] === 'Answer'){
                            obj.answer = l[1].trim()
                            //let q_arr = [...obj.question]
                            let que = obj.question.join('\n')
                            if(!que.includes('_')){
                                setImportStatus({ error: true, info: `No underscore found in fill in the blank. In "${obj.question.join('')}"`, success: false})
                                return
                            }else if(countInstances(que, '_') !== l[1].split(',').length){
                                setImportStatus({ error: true, info: `Answer does not match the underscore in fill in the blank. In "${obj.question.join('')}"`, success: false})
                                return
                            }
                            obj.question = que
                        }
                        data.push(obj)
                        resetObj()
                    }

                }

                setList(data)
                setImportStatus({ error: false, info: 'Invalid Score.', success: true})
            };
            reader.readAsText(localFile);
        }catch{
            setImportStatus({ error: true, info: `Something is wrong while processing please check your file.`, success: false})
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function confirmImport(){
        setImportStatus({ error: false, success: false, info: '' })

        setUploadStatus({ error: false, success: false, loading: true, info: 'Importing Info..'})
        await AxiosInstance.post(`school/import/question/subject/${id}/`, {
            delete: deleteAllQ,
            data: list,
        }, {
        }).then((_r) => {
            setUploadStatus({ error: false, success: true, loading: false, info: 'Successfully imported.'})
            setList([])
            mutate()
        }).catch((_e) => {
            setUploadStatus({ error: true, success: false, loading: false, info: 'Something went wrong.'})
            setImportStatus({ error: false, success: true, info: '' })
        })
    }

    function cancelImport(){
        setList([])
        setImportStatus({ error: false, success: false, info: '' })
    }

    function onClickDeleteAllQ(){
        setDeleteAllQ(!deleteAllQ)
    }

    return (
        <Box mt={3}>
            <Card>
                <CardContent>
                    <Typography
                        variant="body1"
                        sx={{ mb: 1 }}
                    >
                        <MuiLink
                            href="/static/Sample File.docx"
                        >
                            Download this sample file
                        </MuiLink>
                        <span> and save as plain text or .txt format</span>
                    </Typography>
                    <Image
                        src="/static/export_image.png"
                        width={450}
                        height={270}
                        alt="logo"
                        placeholder="blur"
                        blurDataURL="/static/images/default.png"
                        objectFit="contain"
                    />
                    <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                    >
                        If you want special characters to be read please save as UTF-8 format
                    </Typography>
                    <Image
                        src="/static/import_encoding.png"
                        width={400}
                        height={240}
                        alt="logo"
                        placeholder="blur"
                        blurDataURL="/static/images/default.png"
                        objectFit="contain"
                    />
                    <Box mt={2}>
                        {importStatus.success ? (
                            <Box>
                                <Box mb={1}>
                                    <FormControlLabel
                                        label="Delete all existing questions"
                                        control={
                                            <Checkbox
                                                checked={deleteAllQ}
                                                onClick={onClickDeleteAllQ}
                                            />
                                        }
                                    />
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    component="span"
                                    size="small"
                                    onClick={cancelImport}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component="span"
                                    size="small"
                                    sx={{ ml: 1 }}
                                    onClick={confirmImport}
                                >
                                    Confirm
                                </Button>
                            </Box>
                        ):(
                            <ImportSettings
                                onChangeHandleFile={onChangeHandleFile}
                            />
                        )}
                    </Box>
                    {uploadStatus.loading ? (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Typography variant="body1">
                                {uploadStatus.info}
                            </Typography>
                            <LinearProgress />
                        </Box>
                    ):(
                        <Box mt={2}>
                            {uploadStatus.success && (
                                <Typography variant="body1" sx={{ color: '#28A745' }}>
                                    {uploadStatus.info}
                                </Typography>
                            )}
                            {uploadStatus.error && (
                                <Typography variant="body1" sx={{ color: '#DC3545' }}>
                                    {uploadStatus.info}
                                </Typography>
                            )}
                        </Box>
                    )}
                    {importStatus.error && (
                        <Box sx={{ width: '100%', mt: 3 }}>
                            <Box>
                                <Typography variant="body1" color="error">
                                    File Error: {importStatus.info}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box mt={3}>
                        {list.length > 0 && (
                            <Typography
                                variant="h6"
                                sx={{ mb: 1 }}
                            >
                                Preview :
                            </Typography>
                        )}
                        <ListDisplay list={list}/>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ImportQuestionUI;
