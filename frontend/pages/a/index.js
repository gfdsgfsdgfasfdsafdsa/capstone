import Head from 'next/head';
import { DashboardLayout } from '../../components/DashboardLayout';
import NextNProgress from "nextjs-progressbar";
import { Graph } from '../../components/admin/dashboard/Graph';
import {Box, Card, CardContent, Container, Grid, Typography} from '@mui/material';


function Home() {

    return (
        <>
            <DashboardLayout title='Dashboard'>
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
                                md={12}>
                                <Graph />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </DashboardLayout>
        </>
    )

}

// Home.getLayout = (page) => (
//     <main>
//         <DashboardLayout>
//             {page}
//         </DashboardLayout>
//     </main>
// )

export default Home
