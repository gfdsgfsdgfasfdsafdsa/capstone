import { useRouter } from 'next/router';
import Link from 'next/link'
import {
    Box,
    Button,
    ListItem
} from '@mui/material';
import handleRouteId from '../helpers/handleRouteId'

export const NavItem = ({ href, icon, title, ...others }) => {
    const router = useRouter();
    const active = href ? (handleRouteId(router.pathname) === href) : false;
    
    return (
        <ListItem
            disableGutters
            sx={{
                display: 'flex',
                py: 0,
            }}
            {...others}
        >
            <Link
                href={href}
                passHref
            >
                <Button
                    component="a"
                    startIcon={icon}
                    disableRipple
                    sx={{
                        backgroundColor: active && 'rgba(255,255,255, 0.08)',
                        color: active ? 'secondary.main' : 'neutral.300',
                        borderLeft: active ? '4px solid #2196F3' : '',
                        justifyContent: 'flex-start',
                        px: 3,
                        textAlign: 'left',
                        width: '100%',
                        py: 1.5,
                        fontWeight: 500,
                        borderRadius: 0,
                        '& .MuiButton-startIcon:hover': {
                            color: 'secondary.main',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255, 0.08)',
                            color: 'secondary.main',
                            borderLeft: '4px solid #2196F3',
                        }
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        {title}
                    </Box>
                </Button>
            </Link>
        </ListItem>
    );
};

