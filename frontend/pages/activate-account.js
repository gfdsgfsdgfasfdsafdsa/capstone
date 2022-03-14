import {Box, CircularProgress, Container, Typography, Link as MuiLink } from "@mui/material";
import { useRouter } from 'next/router'
import {useEffect, useState} from "react";
import axios from "axios";
import Link from 'next/link'

export default function ActivateAccount(){
    const router = useRouter()
    const [activated, setActivated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(router.query?.token !== undefined){
            activate(router.query?.token)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])

    async function activate(token){
        setLoading(true)
        await axios.post(`${process.env.api}/accounts/activate/` , { token }
        ).then(({ data }) => {
            if(data?.activated){
                setActivated(true)
            }else if(data?.broken){
                setActivated(false)
            }
            setLoading(false)
        }).catch((_er) => {
            setActivated(false)
            setLoading(false)
        })
    }

    return(
        <Box>
            <Box sx={{ height: '65px', backgroundColor: '#1F2937', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="md">
                    <Typography color="white" variant="h5">
                        Course Me
                    </Typography>
                </Container>
            </Box>
            <Container maxWidth="md" sx={{ pt: 5 }}>
                {loading && (
                    <Typography component="div" variant="body1" sx={{ fontSize: '20px', display:'flex', alignItems:'center' }}>
                        <CircularProgress size={30} sx={{ mr: 3 }}/> Activating account
                    </Typography>
                )}
                {!loading && activated && (
                    <Typography variant="body1" sx={{ fontSize: '20px' }}>
                        Your account has been successfully activated &nbsp;
                        <Link href="/" passHref>
                            <MuiLink>
                                click here to login
                            </MuiLink>
                        </Link>
                    </Typography>
                )}
                {!loading && !activated && (
                    <Typography color="error" variant="body1" sx={{ fontSize: '20px' }}>
                        The token is expired or broken.
                    </Typography>
                )}
            </Container>
        </Box>
    )
}