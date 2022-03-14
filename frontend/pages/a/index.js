// import {Main} from 'next/document';
import { Box } from '@mui/material';
import { DashboardLayout } from '../../components/DashboardLayout';

function Home() {

    return (
        <>
            <DashboardLayout>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8
                    }}
                >
                    Admin
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


