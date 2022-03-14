import Head from 'next/head';
import { Box } from '@mui/material';
import { DashboardLayout } from '../../components/DashboardLayout';

function Test() {

    return (
        <DashboardLayout>
            <>
                <Head>
                    <title>
                        Dashboard | Material Kit
                    </title>
                </Head>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8
                    }}
                >
                    test
                </Box>
            </>
        </DashboardLayout>
    )
}

export default Test



