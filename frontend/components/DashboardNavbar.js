import styled from '@emotion/styled';
import {
    AppBar,
    Box,
    Breadcrumbs,
    IconButton,
    Link as MuiLink,
    Toolbar,
    Tooltip,
    Typography,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import {userRole, getRole} from "../config/userRole";
import Notification from "./Notification";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
    const { onSidebarOpen, title, breadcr, userType, ...other } = props;

    return (
        <>
            <DashboardNavbarRoot
                sx={{
                    left: {
                        lg: 270
                    },
                    width: {
                        lg: 'calc(100% - 270px)'
                    }
                }}
                {...other}>
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: 64,
                        left: 0,
                        px: 2
                    }}>
                    <IconButton
                        onClick={onSidebarOpen}
                        sx={{
                            display: {
                                xs: 'inline-flex',
                                lg: 'none'
                            }
                        }}>
                        <MenuIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml:2 }}>
                        <Typography
                            variant="h5"
                            color="black"
                            >
                            {title}
                        </Typography>
                        {breadcr && (
                            <Breadcrumbs aria-label="breadcrumb">
                                {breadcr?.map((v, i) => {
                                   if(v.href){
                                       return(
                                           <Link key={i} href={v.href} passHref>
                                               <MuiLink
                                                   variant="contained"
                                                   color="primary">
                                                   {v.name}
                                               </MuiLink>
                                           </Link>
                                       )
                                   }else {
                                       return (
                                           <Typography key={i} color="text.primary">{v.name}</Typography>
                                       )
                                   }
                                })}
                            </Breadcrumbs>
                        )}

                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    {(getRole(userType) === userRole.SCHOOLADMIN || getRole(userType) === userRole.STUDENT) && (
                        <Box mr={1}>
                            <Notification
                                isStudent={getRole(userType) === userRole.STUDENT}
                            />
                        </Box>
                    )}
                </Toolbar>
            </DashboardNavbarRoot>
        </>
    );
};

