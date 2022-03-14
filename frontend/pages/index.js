import Head from 'next/head';
import NextLink from 'next/link';
import {
    Box,
    Button,
    Container,
    Link,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../libs/index'
import { sessionRoutes } from '../helpers/index'
import LinearIndeterminate from '../components/LinearIndeterminate'

const Login = () => {
    const { login, statusCode, isLoading, setStatusCode } = useAuth()

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const onSubmit = ({ email, password }) => {
        setStatusCode(0)
        login(email, password)
    }

    return (
        <>
            {isLoading && (<LinearIndeterminate/>)}
            <Head>
                <title>Login</title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%',
                    marginTop: '-150px'
                }}
            >
                <Container maxWidth="sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ my: 3 }}>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                Sign in
                            </Typography>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="body2"
                            >
                                Welcome back
                            </Typography>
                            {statusCode === 401 && (
                                <Alert severity="error"
                                    sx={{ mt: 3, mb: -2, }}
                                >
                                    <strong>Email</strong> or <strong>Password</strong> incorrect.
                                </Alert>
                            )}
                            {(statusCode !== 401 && statusCode !== 0 && statusCode !== 200) && (
                                <Alert severity="error"
                                    sx={{ mt: 3, mb: -2, }}
                                >
                                    Something is wrong please contact administrator.
                                </Alert>
                            )}
                        </Box>
                        <TextField
                            fullWidth
                            label="Email Address"
                            margin="normal"
                            name="email"
                            type="email"
                            variant="outlined"
                            {...register("email", { required: "Please Enter your Email." })}
                            error={(errors?.email != undefined)}
                            autoComplete="off"
                            helperText={errors?.email ? errors.email.message : null}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            margin="normal"
                            name="password"
                            type="password"
                            variant="outlined"
                            {...register("password", { required: "Please Enter Password." })}
                            error={(errors?.password != undefined)}
                            autoComplete="off"
                            helperText={errors?.password ? errors.password.message : null}
                        />
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={statusCode === 200}
                            >
                                Sign In
                            </Button>
                        </Box>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            align="right"
                        >
                            Don&apos;t have an account?
                            {' '}
                            <NextLink
                                href="/register"
                                passHref
                            >
                                <Link
                                    component="a"
                                    variant="subtitle2"
                                    underline="hover"
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </NextLink>
                        </Typography>
                    </form>
                </Container>
            </Box>
        </>
    );
};

export default Login


export function getServerSideProps({ req }) {
    const userRole = req.cookies[process.env.userRole]
    const redirect = sessionRoutes(userRole, '/')
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




