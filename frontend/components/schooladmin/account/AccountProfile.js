import {
    Avatar,
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
import Image from "next/image";
import {useState} from "react";
import axiosInstance from "../../../utils/axiosInstance";

export const AccountProfile = ({ school, setSchool, mutate, setStatus, logo }) => {
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
                ...school,
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
        await axiosInstance.post(`${process.env.api}/accounts/profile/` ,
            logo
        )
            .then((_r) => {
            mutate('/accounts/profile/')
            setSchool({ ...school, logoPreview: null })
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

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box sx={{ mb: 2 }}>
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
                    </Box>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h6"
                        sx={{ textAlign: 'center' }}
                    >
                        {school.name}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        {school.description}
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
