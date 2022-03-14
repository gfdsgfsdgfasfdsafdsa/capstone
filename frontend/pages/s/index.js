import Head from 'next/head';
import {Box, Card, CardContent, Container, Grid, Typography} from '@mui/material';
import { Graph } from '../../components/schooladmin/dashboard/Graph';
import { Pie } from '../../components/schooladmin/dashboard/Pie';
import {DashboardLayout} from '../../components/DashboardLayout';
import NextNProgress from "nextjs-progressbar";


const Home = () => (
    <>
        <NextNProgress height={3}/>
        <Head>
            <title>
                Dashboard
            </title>
        </Head>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 2
            }}>
            <Container maxWidth={false}>
                <Grid
                    container
                    spacing={3}>
                    <Grid
                        item
                        lg={8}
                        md={12}
                        xl={9}
                        xs={12}>
                        <Graph />
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={6}
                        xl={3}
                        xs={12}>
                        <Pie sx={{ height: '100%' }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
);

Home.getLayout = (page) => (
    <DashboardLayout title="Dashboard">
        {page}
    </DashboardLayout>
);

export default Home;
