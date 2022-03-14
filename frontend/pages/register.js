import Head from 'next/head';
import NextLink from 'next/link';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormHelperText, Grid,
    Link, MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { sessionRoutes } from '../helpers/index'
import {useEffect, useRef, useState} from "react";
import { AVAILABLE_STRANDS, GENDER } from "../config/settings";
import {useForm} from "react-hook-form";
import LinearIndeterminate from '../components/LinearIndeterminate'
import axios from "axios";
import Alert from "../components/Alert";

const Register = () => {
    const passRef = useRef()
    const emailRef = useRef()
    const { register, watch, handleSubmit, reset, formState: { errors }, } = useForm({
        mode: 'onTouched'
    });

    const [loading, setLoading] = useState(false)
    const [emailExist, setEmailExist] = useState(false)
    const [info, setInfo] = useState({
        message: '',
        error: false,
        success: false,
    })
    const [bDate, setBDate] = useState(new Date().toISOString().slice(0, 10));
    const [age, setAge] = useState({
        value: 0,
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

    useEffect(() => {
        let  dob = new Date(bDate);
        let month_diff = Date.now() - dob.getTime();
        let age_dt = new Date(month_diff);
        let year = age_dt.getUTCFullYear();
        let ageCalculation = Math.abs(year - 1970);
        if(!isNaN(ageCalculation))
            setAge({ ...age, value: ageCalculation })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onSubmit = async (data) => {
        if(calculateAge(bDate)) return

        const { email, password, name, gender, school, strand } = data

        setLoading(true)
        setInfo({ message: '', error: false, success: false })

        await axios.post(`${process.env.api}/accounts/registration/student/` , {
            email, password, name, gender, school, age: age.value, strand, birth_date: bDate,
        }).then(({ data }) => {
            if(data?.email_exist){
                setEmailExist(true)
            }else if(data?.registered){
                reset()
                setInfo({ message: 'We have sent you an email confirmation. Please confirm to login.', error: false, success: true })
                window.location.href = '/register#signup'
            }
            setLoading(false)
        }).catch((_er) => {
            setInfo({ message: 'Something went wrong.', error: true, success: false })
            setLoading(false)
        })
    }

    const password = watch('password')
    const email = watch('email')


    const handleBDateChange = (e) => {
        setBDate(e.target.value);
        calculateAge(e.target.value)
    };

    useEffect(() => {
        setEmailExist(false)
    }, [email])

    return (
        <>
            {loading && (<LinearIndeterminate/>)}
            <Head>
                <title>
                    Register
                </title>
            </Head>
            <Box id="signup"/>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                }}
            >
                <Container maxWidth="xs">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ my: 3, mb: 1 }}>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                Create your Account
                            </Typography>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="body2"
                            >
                                Use your email to create a new account
                            </Typography>
                            <Alert condition={info.error} text={info.message} severity="error"/>
                            <Alert condition={info.success} text={info.message} severity="success"/>
                        </Box>
                        <TextField
                            fullWidth
                            label="Full Name"
                            margin="normal"
                            variant="outlined"
                            size="small"
                            autoComplete="off"
                            {...register("name", { required: "Please Enter your Name" })}
                            error={errors?.name !== undefined}
                            helperText={errors?.name ? errors.name.message : null}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={9}>
                                <TextField
                                    id="date"
                                    label="Birthday"
                                    type="date"
                                    size="small"
                                    value={bDate}
                                    margin="normal"
                                    fullWidth
                                    onChange={handleBDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={age.error}
                                    helperText={age.message}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Age"
                                    margin="normal"
                                    name="age"
                                    type="number"
                                    size="small"
                                    value={age.value}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled={true}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="School"
                            margin="normal"
                            name="school"
                            size="small"
                            variant="outlined"
                            autoComplete="off"
                            {...register("school", { required: "Please Enter your School" })}
                            error={errors?.school !== undefined}
                            helperText={errors?.school ? errors.school.message : null}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Select Gender"
                            defaultValue=""
                            size="small"
                            margin="normal"
                            inputProps={register('gender', {
                                required: 'Please select gender',
                            })}
                            error={errors?.gender !== undefined}
                            helperText={errors?.gender ? errors.gender.message : null}
                        >
                            {GENDER?.map((g) => (
                                <MenuItem key={g} value={g}>{g}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Select Strand"
                            defaultValue=""
                            size="small"
                            margin="normal"
                            inputProps={register('strand', {
                                required: 'Please select strand',
                            })}
                            error={errors?.strand !== undefined}
                            helperText={errors?.strand ? errors.strand.message : null}
                        >
                            {AVAILABLE_STRANDS?.map((strand) => (
                                <MenuItem key={strand} value={strand}>{strand}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Email Address"
                            margin="normal"
                            type="email"
                            variant="outlined"
                            size="small"
                            inputRef={emailRef}
                            {...register("email", {
                                required: "Please enter email",
                            })}
                            error={(errors?.email !== undefined || emailExist)}
                            helperText={errors?.email || emailExist ? emailExist ? 'Email already in used' : errors.email.message : null}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            margin="normal"
                            type="password"
                            inputRef={passRef}
                            size="small"
                            variant="outlined"
                            {...register("password", {
                                required: "Please enter your password",
                                minLength: {
                                    value: 8,
                                    message: 'Password must at least 8 characters'
                                },
                            })}
                            error={(errors?.password !== undefined)}
                            helperText={errors?.password ? errors.password.message : null}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            margin="normal"
                            {...register("confirmPassword", {
                                validate: (value) => value !== password ? "The password do not match" : undefined
                            })}
                            error={errors?.confirmPassword !== undefined}
                            helperText={errors?.confirmPassword ? errors.confirmPassword.message : null}
                            type="password"
                            size="small"
                            variant="outlined"
                        />
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                ml: -1
                            }}
                        >
                            <Checkbox
                                name="policy"
                                size="small"
                            />
                            <Typography
                                color="textSecondary"
                                variant="body2"
                            >
                                I have read the
                                {' '}
                                <NextLink
                                    href="#"
                                    passHref
                                >
                                    <Link
                                        color="primary"
                                        underline="always"
                                        variant="subtitle2"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                        {Boolean(false) && (
                            <FormHelperText error>
                                test
                            </FormHelperText>
                        )}
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                fullWidth
                                size="small"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            align="right"
                            sx={{ pb: 3 }}
                        >
                            Have an account?
                            {' '}
                            <NextLink
                                href="/"
                                passHref
                            >
                                <Link
                                    variant="subtitle2"
                                    underline="hover"
                                >
                                    Sign In
                                </Link>
                            </NextLink>
                        </Typography>
                    </form>
                </Container>
            </Box>
        </>
    );
};

export default Register;


export function getServerSideProps({ req }) {
    const userRole = req.cookies[process.env.userRole]
    const redirect = sessionRoutes(userRole, '/register')
    if (redirect) {
        return {
            redirect: {
                permanent: false,
                destination: redirect
            }
        }
    }

    return {
        props: {}
    }
}
