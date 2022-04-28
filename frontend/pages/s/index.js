import Head from 'next/head';
import {Box, Card, CardContent, Container, Grid, Typography} from '@mui/material';
import { Graph } from '../../components/schooladmin/dashboard/Graph';
import { Pie } from '../../components/schooladmin/dashboard/Pie';
import {DashboardLayout} from '../../components/DashboardLayout';
import NextNProgress from "nextjs-progressbar";
import axios from "axios";
import useSWR from "swr";

const Home = ({ data }) => {
    const { data: d } = useSWR(`school/dashboard/`, {
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
                                currentYear={d?.current_year ? d?.current_year : []}
                                previousYear={d?.previous_year ? d?.previous_year : []}
                            />
                        </Grid>
                        <Grid
                            item
                            lg={4}
                            md={6}
                            xl={3}
                            xs={12}>
                            <Pie
                                courseRank={d?.course_rank ? d?.course_rank : []}
                                sx={{ height: '100%' }}
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
        const { data } = await axios.get(`${process.env.api}/school/dashboard/` , {
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
