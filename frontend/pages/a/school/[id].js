import {DashboardLayout} from "../../../components/DashboardLayout";
import {Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Tab,
    Tabs,
    TextField,
    Typography,
    Divider
} from "@mui/material";
import Head from 'next/head';
import {AccountProfile} from "../../../components/admin/school/AccountProfile";
import { AccountProfileDetails } from "../../../components/admin/school/AccountProfileDetails";
import { useState, useEffect, useRef } from 'react';
import NextNProgress from "nextjs-progressbar";
import {useRouter} from "next/router";
import useSWR, {useSWRConfig} from "swr";
import {
    Edit as EditIcon,
} from '@mui/icons-material'
import {axiosInstance} from "../../../utils";
import AlertCollapse from "../../../components/AlertCollapse";


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

export default function SchoolId(){
    const router = useRouter()
    const { mutate } = useSWRConfig()
    const { id } = router.query
    const { data, error } = useSWR(id ? `myadmin/schools/${id}/` : [])

    if(error?.response?.status === 404)
        router.push('/404')

    const [tabValue, setTabValue] = useState(0);

    const [school, setSchool] = useState({
        logoPreview: null,
    })


    //details update status
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

        setTabValue(newValue);
    };

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
        await axiosInstance.put(`myadmin/schools/${id}/`, {
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

    if(!data) return <div />

    return(
        <DashboardLayout title="Update School">
            <NextNProgress height={3}/>
            <Head>
                <title>
                    Update School
                </title>
            </Head>
            <Container maxWidth="md">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
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
                    <TabPanel value={tabValue} index={0}>
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
                            spacing={3}>
                            <Grid
                                item
                                lg={4}
                                md={6}
                                xs={12}>
                                <AccountProfile
                                    logo={data?.logo_url ? data.logo_url : ''}
                                    school={school}
                                    setSchool={setSchool}
                                    mutate={mutate}
                                    setStatus={setStatus}
                                    id={id}
                                />
                            </Grid>
                            <Grid
                                item
                                lg={8}
                                md={6}
                                xs={12}>
                                <AccountProfileDetails
                                    id={id}
                                    school={data}
                                    setSchool={setSchool}
                                    mutate={mutate}
                                    setStatus={setStatus}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
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
                                    container
                                    spacing={3}>
                                    <Grid
                                        item
                                        md={4}
                                        xs={12}>
                                        <Typography variant="h6">
                                            Change Password
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
                                        <Divider />
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
    )
}
