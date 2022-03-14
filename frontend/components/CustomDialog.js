import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const CustomDialog = ({ openDialog,
                          setOpenDialog,
                          title,
                          content,
                          onClickConfirm,
                          cancelText = "Cancel",
                          confirmText = "Confirm"
}) => {
    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{ sx: { marginTop: '-200px', px:1, pt:1 } }}
                TransitionProps={{ timeout: 0, enter: false }}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>{cancelText}</Button>
                    <Button onClick={onClickConfirm} autoFocus>
                        {confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CustomDialog