import {DashboardLayout} from "../../components/DashboardLayout";
import {
    Box, Button,
    Card,
    CardContent,
    Container,
    FormControl,
    Grid,
    InputLabel, MenuItem, Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import Head from 'next/head'
import {useEffect, useState} from "react";
import NextNProgress from "nextjs-progressbar";
import axiosInstance from "../../utils/axiosInstance";
import AlertCollapse from "../../components/AlertCollapse";
import axios from "axios";
import useSWR, {useSWRConfig} from "swr";
import {useForm} from "react-hook-form";
import {AVAILABLE_STRANDS, GENDER} from "../../config/settings";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Account({ account }){
    const { data: a, isValidating } = useSWR('/accounts/profile/', {
        fallbackData: account,
        revalidateOnFocus: false,
    })
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({
        mode: 'onTouched'
    });
    const { mutate } = useSWRConfig()

    function defaultValue(){
        setValue('name', a?.name)
        setValue('school', a?.school)
        setValue('email', a?.email)
        setValue('age', a?.age)
        clearErrors()
    }

    useEffect(() => {
        defaultValue()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [value, setVal] = useState(0);

    //Age birthdate
    const [bDate, setBDate] = useState(a?.birth_date ? a?.birth_date : '');
    const [age, setAge] = useState({
        value: a?.age,
        error: false,
        message: '',
    })
    function calculateAge(dateSet){
        let  dob = new Date(dateSet);
        let month_diff = Date.now() - dob.getTime();
        let age_dt = new Date(month_diff);
        let year = age_dt.getUTCFullYear();
        let ageCalculation = Math.abs(year - 1970);
        let error = false

        if(!isNaN(ageCalculation)){
            if(ageCalculation < 15){
                error = true
                setAge({
                    error: true,
                    message: 'Minimum age is 15.',
                    value: ageCalculation,
                })
            }else if(ageCalculation > 60){
                error = true
                setAge({
                    error: true,
                    message: 'Maximum age is 60.',
                    value: ageCalculation,
                })
            }else{
                error = false
                setAge({
                    error: false,
                    message: '',
                    value: ageCalculation,
                })
            }
        }
        return error
    }

    const handleBDateChange = (e) => {
        setBDate(e.target.value);
        calculateAge(e.target.value)
    };

    const [edit, setEdit] = useState(false)

    const [status, setStatus] = useState({
        error: false,
        success: false,
        loading: false,
        message: '',
    })

    const handleChange = (event, newValue) => {
        if(status.loading) return

        setStatus({
            error: false,
            success: false,
            loading: false,
            message: '',
        })
        setVal(newValue);
    };

    const [gender, setGender] = useState(a?.gender ? a.gender : 'Male')
    const [strand, setStrand] = useState(a?.strand)

    function onClickEdit(){
        setEdit(true)
    }

    function onClickClose(){
        defaultValue()
        setAge({ ... age, error: false, message: '' })
        setStrand(a?.strand)
        setGender(a?.gender)
        setEdit(false)
    }

    const onSubmit = async (data) => {
        if(calculateAge(bDate)) return

        data['gender'] = gender
        data['strand'] = strand
        data['birth_date'] = bDate
        data['age'] = age.value
        setEdit(false)
        setStatus({
            error: false,
            success: false,
            loading: true,
            message: 'Updating Details',
        })
        await axiosInstance.post(`${process.env.api}/accounts/profile/` , data).then((_r) => {
            mutate('/accounts/profile/')
            setStatus({
                error: false,
                success: true,
                loading: false,
                message: 'Details has been successfully updated.',
            })
        }).catch((_e) => {
            setStatus({
                error: true,
                success: false,
                loading: false,
                message: 'Failed to update details.',
            })
            setEdit(true)
        })
    }


    const [password, setPassword] = useState({
        newPass: '',
        newPassError: '',
        currentPass: '',
        currentPassError: '',
    })

    function onChangePass(e){
        setPassword(
            { ...password, [e.target.name]: e.target.value, newPassError: '', currentPassError: '' }
        )
    }

    async function updatePassOnClick(){
        if(password.newPass.length < 8){
            setPassword({ ...password, newPassError: 'Please enter at least 8 characters.' })
            return
        }
        if(password.newPass !== password.currentPass){
            setPassword({ ...password, currentPassError: 'Password do not match.' })
            return
        }
        setStatus({
            error: false,
            success: false,
            loading: true,
            message: 'Updating new password.',
        })
        await axiosInstance.post(`${process.env.api}/accounts/profile/`, {
            password: password.newPass
        }).then((_r) => {
            setPassword({
                newPass: '',
                newPassError: '',
                currentPass: '',
                currentPassError: '',
            })
            setStatus({
                error: false,
                success: true,
                loading: false,
                message: 'Password has been successfully updated.',
            })
        }).catch((_e) => {
            setStatus({
                error: true,
                success: false,
                loading: false,
                message: 'Failed to update password.',
            })
        })
    }

    return (
        <>
            <NextNProgress height={3}/>
            <DashboardLayout title="Account">
                <Head>
                    <title>
                        Account
                    </title>
                </Head>
                <Container maxWidth="md">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="General"
                                     sx={{
                                         fontSize: '14px',
                                         textTransform: 'none',
                                         fontWeight: '500',
                                         padding: '12px 0px',
                                         minWidth: 'unset',
                                     }}
                                     {...a11yProps(0)} />
                                <Tab label="Password"
                                     sx={{
                                         fontSize: '14px',
                                         textTransform: 'none',
                                         fontWeight: '500',
                                         padding: '12px 0px',
                                         minWidth: 'unset',
                                         marginLeft: '24px',
                                     }}
                                     {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
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
                            <Card>
                                <CardContent>
                                    <Grid
                                        component="form"
                                        onSubmit={handleSubmit(onSubmit)}
                                        container
                                        spacing={3}>
                                        <Grid
                                            item
                                            md={4}
                                            xs={12}>
                                            <Typography variant="h6">
                                                Account Details*
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            md={7}
                                            xs={12}>
                                            <TextField
                                                size="small"
                                                label="Full Name" variant="outlined"
                                                autoComplete="off"
                                                disabled={!edit}
                                                sx={{ width: '100%', mb: 3 }}
                                                InputLabelProps={{ shrink: true }}
                                                {...register("name", { required: "Name is required." })}
                                                error={errors?.name !== undefined}
                                                helperText={errors?.name ? errors.name.message : null}
                                            />
                                            <FormControl fullWidth
                                                         sx={{ mb: 3 }}
                                            >
                                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={gender}
                                                    label="Gender"
                                                    size="small"
                                                    disabled={!edit}
                                                    onChange={(e) => setGender(e.target.value)}
                                                >
                                                    {GENDER?.map((g) => (
                                                        <MenuItem key={g} value={g}>{g}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth
                                                         sx={{ mb: 3 }}
                                            >
                                                <InputLabel id="demo-simple-select-label">Strand</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={strand}
                                                    label="Strand"
                                                    size="small"
                                                    disabled={!edit}
                                                    onChange={(e) => setStrand(e.target.value)}
                                                >
                                                    {AVAILABLE_STRANDS?.map((strand) => (
                                                        <MenuItem key={strand} value={strand}>{strand}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Grid container spacing={2}>
                                                <Grid item xs={9}>
                                                    <TextField
                                                        id="date"
                                                        label="Birthday"
                                                        type="date"
                                                        size="small"
                                                        disabled={!edit}
                                                        value={bDate}
                                                        onChange={handleBDateChange}
                                                        sx={{ width: '100%', mb: 3 }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        error={age.error}
                                                        helperText={age.message}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        size="small"
                                                        disabled={true}
                                                        type="number"
                                                        autoComplete="off"
                                                        value={age.value}
                                                        label="Age"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <TextField
                                                autoComplete="off"
                                                size="small"
                                                disabled={!edit}
                                                label="School" variant="outlined"
                                                sx={{ width: '100%', mb:3 }}
                                                InputLabelProps={{ shrink: true }}
                                                {...register("school", { required: "School is required." })}
                                                error={errors?.school !== undefined}
                                                helperText={errors?.school ? errors.school.message : null}
                                            />
                                            <TextField
                                                autoComplete="off"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                disabled={true}
                                                {...register("email")}
                                                label="Email" variant="outlined"
                                                sx={{ width: '100%', mb:3 }}
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                {edit ? (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            sx={{ mr: 1 }}
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
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Box sx={{ mb: 1 }}>
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
                            <Card>
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}>
                                        <Grid
                                            item
                                            md={4}
                                            xs={12}>
                                            <Typography variant="h6">
                                                Change Password*
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            md={7}
                                            xs={12}>
                                            <TextField
                                                value={password.newPass}
                                                name="newPass"
                                                size="small"
                                                label="Password" variant="outlined"
                                                sx={{ width: '100%', mb: 3 }}
                                                onChange={onChangePass}
                                                type="password"
                                                error={password.newPassError.length >= 1}
                                                helperText={password.newPassError.length ? password.newPassError : null}
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={password.currentPass}
                                                type="password"
                                                name="currentPass"
                                                size="small"
                                                label="Password Confirm" variant="outlined"
                                                sx={{ width: '100%', mb: 3 }}
                                                onChange={onChangePass}
                                                error={password.currentPassError.length >= 1}
                                                helperText={password.currentPassError.length ? password.currentPassError : null}
                                                autoComplete="off"
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button variant="outlined"
                                                        onClick={updatePassOnClick}
                                                        size="small"
                                                        endIcon={<EditIcon/>}
                                                        disabled={status.loading}
                                                >
                                                    Update Password
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </TabPanel>
                    </Box>
                </Container>
            </DashboardLayout>
        </>
    )
}

export async function getServerSideProps({ req }) {
    let account = []
    try {
        const { data } = await axios.get(`${process.env.api}/accounts/profile/` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        account = data
    } catch (_e){
        account = []
    }
    return {
        props: {
            account
        }
    }
}
