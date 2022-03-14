import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Graph } from '../../components/student/dashboard/Graph';
import { DashboardLayout } from '../../components/DashboardLayout';
import Recommended from "../../components/student/dashboard/Recommended";
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
                        <Recommended/>
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
