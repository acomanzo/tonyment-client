import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


export const ConfirmationContext = {
    REGISTRATION: 1, 
    TO_SAVE_CHANGES: 2, 
    TO_FINALIZE_BRACKET: 3
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
});

export default function Confirmation({open, confirm, onClose, tourney, context}) {

    let title;
    let dialogContentText;
    let acceptText;
    const purpose = context.purpose;
    const registering = context.registering;

    switch (purpose) {
        case ConfirmationContext.REGISTRATION:
            title = registering ? 'Register now?' : 'Deregister?';
            dialogContentText = registering ? `By registering, you agree to compete in ${tourney.name}.` : 
            `By deregistering, you will lose your place in ${tourney.name} and will have to reregister if you change your mind.`;
            acceptText = registering ? `Sign me up!` : `Deregister 😭`;
            break;
        case ConfirmationContext.TO_SAVE_CHANGES:
            title = 'Save changes?';
            dialogContentText = 'Are you sure you want to save changes?';
            acceptText = 'Yes'
            break;
        case ConfirmationContext.TO_FINALIZE_BRACKET:
            title = 'Finalize bracket?';
            dialogContentText = 'Are you sure you want to finalize the bracket? By doing so, registration will close.';
            acceptText = 'Yes'
            break;
        default:
            title = 'Error';
            dialogContentText = 'Something went wrong';
            acceptText = "Don't click me";
            break;
    }

    return (
        <div>
            <Dialog 
                open={open}
                TransitionComponent={Transition}
                keepMounted 
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirm} color="primary">
                        {acceptText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}