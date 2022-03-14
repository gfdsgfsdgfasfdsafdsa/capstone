import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';
import {
    FileUpload as FileUploadIcon,
} from '@mui/icons-material'
import {useState} from "react";
import axiosInstance from "../../../utils/axiosInstance";
import {useRouter} from "next/router";


export const AccountProfile = ({ school, setSchool, mutate, setStatus, logo, id }) => {

    const [edit, setEdit] = useState(false)
    const [file, setFile] = useState(null)

    function onChangeHandleFile(e) {
        setEdit(true)
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            setFile(file)
            setSchool({
                logoPreview: URL.createObjectURL(file),
            })
        }
    }

    function onClickCancel(){
        setEdit(false)
        setSchool({
            ...school,
            logoPreview: null,
        })
    }

    async function onConfirm() {
        setEdit(false)
        setStatus({
            error: false,
            success: false,
            loading: true,
            message: 'Updating..',
        })
        const logo = new FormData()
        logo.append('logo', file)

        await axiosInstance.put(`myadmin/schools/${id}/`, logo)
            .then((_r) => {
            mutate(`myadmin/schools/${id}`)
            setStatus({
                error: false,
                success: true,
                loading: false,
                message: 'New logo has been set.',
            })
        }).catch((_e) => {
            setStatus({
                error: true,
                success: false,
                loading: false,
                message: 'Failed to update update logo.',
            })
            setEdit(true)
        })
    }

    return(
        <Card>
        <CardContent>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {school.logoPreview ? (
                    <Box sx={{ position: 'relative' }}>
                        <Box component="img"
                                src={school.logoPreview}
                                alt="Image"
                                sx={{
                                    height: '70px',
                                    width: '70px,'
                                }}
                        />
                    </Box>
                ): (
                    <Box sx={{ position: 'relative' }}>
                        <Box component="img"
                                src={logo ? logo : '/static/images/default.jpg'}
                                alt="Image"
                                sx={{
                                    height: '70px',
                                    width: '70px,'
                                }}
                        />
                    </Box>
                )}
                <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                    sx={{ textAlign: 'center' }}
                >
                    School Name
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                >
                    Description
                </Typography>
            </Box>
        </CardContent>
        <Divider />
        <CardActions>
            {edit ? (
                <>
                    <Button
                        size="small"
                        color="error"
                        fullWidth
                        onClick={onClickCancel}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        fullWidth
                        onClick={onConfirm}
                        variant="outlined"
                    >
                        Confirm
                    </Button>
                </>
            ): (
                <>
                    <input
                        style={{ display: "none" }}
                        id="update-logo-1"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={onChangeHandleFile}
                        onClick={(e) => {e.target.value = ''}}
                    />
                    <label htmlFor="update-logo-1" style={{ width: '100%' }}>
                        <Button
                            size="small"
                            color="primary"
                            component="span"
                            fullWidth
                            variant="outlined"
                            endIcon={<FileUploadIcon/>}
                        >
                            Update Logo
                        </Button>
                    </label>
                </>
            )}
        </CardActions>
    </Card>
    )

}