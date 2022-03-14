import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import {useForm} from "react-hook-form";
import axiosInstance from "../../../utils/axiosInstance";

export const AccountProfileDetails = ({ school, setSchool, mutate, setStatus }) => {
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({
        mode: 'onTouched'
    });

    function defaultValue(){
        setValue('name', school.name)
        setValue('description', school.description)
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
        data['details'] = 1
        await axiosInstance.post(`${process.env.api}/accounts/profile/` , data).then((_r) => {
            mutate('/accounts/profile/')
            setSchool({ ...school, name: data.name, description: data.description })
            setStatus({
                error: false,
                success: true,
                loading: false,
                message: 'School Info has been successfully updated.',
            })
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
        defaultValue()
        setEdit(false)
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader
                    subheader="The information can be edited"
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
                                autoComplete="off"
                                size="small"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                label="School Name"
                                {...register("name", { required: "Please Enter School name" })}
                                error={errors?.name !== undefined}
                                helperText={errors?.name ? errors.name.message : null}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}>
                            <TextField
                                disabled={!edit}
                                autoComplete="off"
                                size="small"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                label="Enter short Description"
                                {...register("description")}
                                variant="outlined"
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
