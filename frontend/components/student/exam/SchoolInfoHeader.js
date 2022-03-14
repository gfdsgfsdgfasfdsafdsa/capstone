import {
    Box,
    Typography,
    Divider,
    Skeleton,
    Avatar, Button,
    Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableContainer, TableCell, Table, TableHead, TableRow, TableBody, CircularProgress,
} from '@mui/material'
import Image from 'next/image'
import {useEffect, useRef} from "react";

export default function SchoolInfoHeader ({ logoUrl, name, description,
                                              dScrollOpen, setDScrollOpen, courses }){
    // Dialog Scroll
    const handleClickScrollOpen = () => {
        setDScrollOpen(true);
    };

    const handleScrollClose = () => {
        setDScrollOpen(false);
    };


    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (dScrollOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dScrollOpen]);

    return (
        <>
            <Dialog
                open={dScrollOpen}
                onClose={handleScrollClose}
                scroll="paper"
                maxWidth="md"
                TransitionProps={{ timeout: 0, enter: false }}
            >
                <DialogTitle id="scroll-dialog-title">
                    <Typography variant="body1" component="div">
                        {!courses ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress
                                    size={15}
                                    sx={{ mr: 2 }}
                                /> Fetching data...
                            </Box>
                        ):'Available Courses'}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component="div"
                    >
                        <TableContainer>
                            <Table size="small" sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">
                                            Courses
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses?.courses?.map((course, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left">
                                                    {course}
                                                </TableCell>
                                            </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size="small" onClick={handleScrollClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between' ,
                    flexWrap: 'wrap',
                    px: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'start',
                        my: 2
                    }}
                >
                    <Image
                        src={logoUrl ? logoUrl: "/static/images/default.png"}
                        alt="Picture of the author"
                        width={80}
                        height={80}
                        quality={100}
                        placeholder="blur"
                        blurDataURL={logoUrl ? logoUrl: "/static/images/default.png"}
                    />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h5">
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mt: 1}}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 3 }}
                        onClick={handleClickScrollOpen}
                    >
                        View Available Courses
                    </Button>
                </Box>
            </Box>
            <Divider/>
        </>
    )
}
