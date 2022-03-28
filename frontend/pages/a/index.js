import Head from 'next/head';
import { DashboardLayout } from '../../components/DashboardLayout';
import NextNProgress from "nextjs-progressbar";
import { Graph } from '../../components/admin/dashboard/Graph';
import {Box, Card, CardContent, Container, Grid, Typography} from '@mui/material';
import useSWR from "swr";
import axios from "axios";


function Home({ data }) {
    const { data: d } = useSWR(`myadmin/dashboard/`, {
        fallbackData: data,
        revalidateOnFocus: false,
    });

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
                                <Graph
                                    school={d?.school ? d?.school : []}
                                />
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

export async function getServerSideProps({ req }) {
    let d = []
    try {
        const { data } = await axios.get(`${process.env.api}/myadmin/dashboard/` , {
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
