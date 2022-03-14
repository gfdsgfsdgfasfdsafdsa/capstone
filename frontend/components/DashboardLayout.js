import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './DashboardNavbar';
import { DashboardSidebar } from './DashboardSidebar';
import { setRoutes } from '../config/index'
import {FullPageLoad, Loading} from "./Index";
import { useAuth } from '../libs/index'

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
        paddingLeft: 270
    }
}));

export const DashboardLayout = (props) => {

    const [items, setItems] = useState()
    const { logout, user } = useAuth()

    const { title, breadcr, children } = props;
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setItems(setRoutes())
    }, [])

    //if(!items) return <Loading/>

    return (
        <>
            <DashboardLayoutRoot>
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                        width: '100%',
                        marginTop: '10px'
                    }}
                >
                    {children}
                </Box>
            </DashboardLayoutRoot>
            <DashboardNavbar
                title={title}
                breadcr={breadcr}
                userType={user?.type}
                onSidebarOpen={() => setSidebarOpen(true)}
            />
            <DashboardSidebar
                user={user}
                logout={logout}
                onClose={() => setSidebarOpen(false)}
                items={items}
                open={isSidebarOpen}
            />
        </>
    );
};
