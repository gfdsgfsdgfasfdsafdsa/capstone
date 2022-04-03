import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Graph } from '../../components/student/dashboard/Graph';
import { DashboardLayout } from '../../components/DashboardLayout';
import Recommended from "../../components/student/dashboard/Recommended";
import NextNProgress from "nextjs-progressbar";
import useSWR from "swr";
import axios from "axios";

const Home = ({ data }) => {
    const { data: d } = useSWR(`student/dashboard/`, {
        fallbackData: data,
        revalidateOnFocus: false,
    });

    return (
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
                            <Graph
                                school={d?.school ? d?.school : []}
                            />
                        </Grid>
                        <Grid
                            item
                            lg={4}
                            md={6}
                            xl={3}
                            xs={12}>
                            <Recommended
                                data={d?.recent_result ? d?.recent_result: []}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    )
}

Home.getLayout = (page) => (
    <DashboardLayout title="Dashboard">
        {page}
    </DashboardLayout>
);

export default Home;

export async function getServerSideProps({ req }) {
    let d = []
    try {
        const { data } = await axios.get(`${process.env.api}/student/dashboard/` , {
            headers: {
                Authorization: `Bearer ${req.cookies['accessToken']}`,
            },
        })
        d = data
    } catch (_e){
        d = []
    }
    return {
        props: {
            data: d
        }
    }
}
