import {DashboardLayout} from "../../../components/DashboardLayout";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    CardActions,
    Container
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import {useForm} from "react-hook-form";
import NextNProgress from "nextjs-progressbar";
import axiosInstance from "../../../utils/axiosInstance";
import {
    FileUpload as FileUploadIcon,
    Save as SaveIcon,
} from '@mui/icons-material'
import AlertCollapse from "../../../components/AlertCollapse";

export default function Register(){

    const passRef = useRef()
    const emailRef = useRef()
    const { register, watch, handleSubmit, reset, formState: { errors }, } = useForm({
        mode: 'onTouched'
    });

    const [loading, setLoading] = useState(false)
    const [emailExist, setEmailExist] = useState(false)
    const [status, setStatus] = useState({
        error: false,
        success: false,
        loading: false,
        message: '',
    })

    const [file, setFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)

    function onChangeHandleFile(e) {
        let file = null
        try {
            file = e.target.files[0]
        } finally {
            setFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (data) => {
        const { name, description, email, password } = data
        setStatus({
            error: false,
            success: false,
            loading: true,
            message: 'Saving data..',
        })
        const formData = new FormData()
        if(file)
            formData.append('logo', file)
        else
            formData.append('logo', null)

        formData.append('name', name)
        formData.append('description', description)
        formData.append('school_email', email)
        formData.append('password', password)

        await axiosInstance.post(`myadmin/schools/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(({ data }) => {
            if(data?.email_exist){
                setEmailExist(true)
                setStatus({
                    error: false,
                    success: false,
                    loading: false,
                    message: 'Failed to save data.',
                })
            }else{
                reset()
                setLogoPreview(null)
                setStatus({
                    error: false,
                    success: true,
                    loading: false,
                    message: 'School has been create successfully.',
                })
            }
        }).catch((_e) => {
            setStatus({
                error: true,
                success: false,
                loading: false,
                message: 'Failed to save data.',
            })
        })
    }

    const password = watch('password')
    const email = watch('email')

    useEffect(() => {
        setEmailExist(false)
    }, [email])

    return(
        <DashboardLayout title='Add School'>
            <NextNProgress height={3}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container maxWidth='md'>
                    <Box mb={2}>
                        <AlertCollapse
                            condition={status.loading}
                            severity="loading"
                            text={status.message}
                            onClick={() => setStatus({ ...status, loading: false })}
                        />
                        <AlertCollapse
                            condition={status.error}
                            severity="error"
                            text={status.message}
                            onClick={() => setStatus({ ...status, error: false })}
                        />
                        <AlertCollapse
                            condition={status.success}
                            text={status.message}
                            onClick={() => setStatus({ ...status, success: false })}
                        />
                    </Box>
                    <Grid
                        container
                        spacing={3}
                        sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Grid
                            item
                            lg={3}
                            md={6}
                            xs={12}>
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        {logoPreview ? (
                                            <Box sx={{ position: 'relative' }}>
                                                <Box component="img"
                                                     src={logoPreview}
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
                                                     src={'/static/images/default.jpg'}
                                                     alt="Image"
                                                     sx={{
                                                         height: '70px',
                                                         width: '70px,'
                                                     }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                                <Divider />
                                <CardActions>
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
                                            Select Logo
                                        </Button>
                                    </label>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid
                            item
                            lg={9}
                            md={6}
                            xs={12}>
                            <Card>
                                <CardHeader
                                    subheader="Please enter the school information"
                                    title="School Details"
                                />
                                <Divider />
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}>
                                        <Grid
                                            item
                                            xs={12}>
                                            <TextField
                                                fullWidth
                                                label="School Name"
                                                variant="outlined"
                                                size="small"
                                                autoComplete="off"
                                                {...register("name", { required: "Please Enter the School name" })}
                                                error={errors?.name !== undefined}
                                                helperText={errors?.name ? errors.name.message : null}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Enter short Description"
                                                variant="outlined"
                                                size="small"
                                                autoComplete="off"
                                                {...register("description", { required: "Please Enter the School's description" })}
                                                error={errors?.description !== undefined}
                                                helperText={errors?.description ? errors.description.message : null}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                variant="outlined"
                                                size="small"
                                                type="email"
                                                inputRef={emailRef}
                                                {...register("email", {
                                                    required: "Please enter the school's email",
                                                })}
                                                error={(errors?.email !== undefined || emailExist)}
                                                helperText={errors?.email || emailExist ? emailExist ? 'Email already in used' : errors.email.message : null}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                variant="outlined"
                                                size="small"
                                                type="password"
                                                inputRef={passRef}
                                                {...register("password", {
                                                    required: "Please enter the password",
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Password must at least 8 characters'
                                                    },
                                                })}
                                                error={(errors?.password !== undefined)}
                                                helperText={errors?.password ? errors.password.message : null}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                variant="outlined"
                                                size="small"
                                                type="password"
                                                {...register("confirmPassword", {
                                                    validate: (value) => value !== password ? "The password do not match" : undefined
                                                })}
                                                error={errors?.confirmPassword !== undefined}
                                                helperText={errors?.confirmPassword ? errors.confirmPassword.message : null}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        p: 2
                                    }}
                                >
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        type="submit"
                                        disabled={status.loading}
                                        endIcon={(<SaveIcon/>)}
                                        size="small"
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </form>
        </DashboardLayout>
    )
}
