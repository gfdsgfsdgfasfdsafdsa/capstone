import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Container,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    ScreenSearchDesktopOutlined,
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react';
import {useForm} from "react-hook-form";
import { STATUS } from "../../../config/settings";
import {useRouter} from "next/router";
import axiosInstance from "../../../utils/axiosInstance";

export const AccountProfileDetails = ({ school, setSchool, mutate, setStatus, id }) => {

    const { register, watch, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({
        mode: 'onTouched'
    });

    const emailRef = useRef()

    const [emailExist, setEmailExist] = useState(false)

    const email = watch('email')

    function defaultValue(){
        setValue('name', school?.name)
        setValue('description', school?.description)
        setValue('email', school?.email)
        clearErrors()
    }

    useEffect(() => {
        defaultValue()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [edit, setEdit] = useState(false)

    const onSubmit = async (data) => {
        setEdit(false)
        setStatus({
            error: false,
            success: false,
            loading: true,
            message: 'Updating School Info',
        })
        await axiosInstance.put(`myadmin/schools/${id}/`, data).then(({ data }) => {
            if(data?.email_exist){
                setEdit(true)
                setEmailExist(true)
                setStatus({
                    error: false,
                    success: false,
                    loading: false,
                    message: 'School Info has been successfully updated.',
                })
            }else{
                mutate(`myadmin/schools/${id}`, {
                    name: data.name,
                    email: data.email,
                    description: data.description,
                }, false)
                setSchool({ ...school, name: data.name, description: data.description })
                setStatus({
                    error: false,
                    success: true,
                    loading: false,
                    message: 'School Info has been successfully updated.',
                })
            }
        }).catch((_e) => {
            setStatus({
                error: true,
                success: false,
                loading: false,
                message: 'Failed to update School Info.',
            })
            setEdit(true)
        })
    }

    function onClickEdit(){
        setEdit(true)
    }

    function onClickClose(){
        setEmailExist(false)
        defaultValue()
        setEdit(false)
    }


    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                                disabled={!edit}
                                fullWidth
                                label="School Name"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
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
                                disabled={!edit}
                                fullWidth
                                label="Enter short Description"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                autoComplete="off"
                                name="description"
                                {...register("description", { required: "Please Enter the School's description" })}
                                error={errors?.description !== undefined}
                                helperText={errors?.description ? errors.description.message : null}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}>
                            <TextField
                                disabled={!edit}
                                fullWidth
                                label="Email"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
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
                    {edit ? (
                        <>
                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                endIcon={<CloseIcon/>}
                                onClick={onClickClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 1 }}
                                endIcon={<SaveIcon/>}
                            >
                                Confirm
                            </Button>
                        </>
                    ):(
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={onClickEdit}
                            endIcon={<EditIcon/>}
                        >
                            Edit Details
                        </Button>
                    )}
                </Box>
            </Card>
        </Box>
    );
};