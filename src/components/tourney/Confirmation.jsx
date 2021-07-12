import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
});

export default function Confirmation({open, register, onClose, tourney, registering}) {

    let dialogContentText = registering ? `By registering, you agree to compete in ${tourney.name}.` : 
        `By deregistering, you will lose your place in ${tourney.name} and will have to reregister if you change your mind.`;

    let acceptText = registering ? `Sign me up!` : `Deregister 😭`;

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
                <DialogTitle id="alert-dialog-slide-title">Register Now?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={register} color="primary">
                        {acceptText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}