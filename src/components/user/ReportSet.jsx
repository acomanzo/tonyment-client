import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ReportSet({open, onClose, submit, set}) {

    const competitor1 = set.competitors[0].tag;
    const competitor2 = set.competitors[1] ? set.competitors[1].name : 'buy';

    const contentStyle = {
        display: 'grid', 
        width: '500px',
        gridTemplateColumns: 'repeat(2, 50%)', 
        justifyItems: 'center',
    };

    console.log(set);

    console.log(set.competitors);

    const onSubmit = () => {
        const c1Wins = document.getElementById('competitor-1-wins').value;
        const c2Wins = document.getElementById('competitor-2-wins').value;

        const c1Id = set.competitors[0].id;
        const c2 = set.competitors;

        if (c2) {
            const c1Won = c1Wins > c2Wins;
            c1Won ? submit(set, c1Id, c1Wins, c2Wins) : submit(set, c2.id, c2Wins, c1Wins);
        } else {
            submit(set, c1Id, c1Wins, 0);
        }
    };

    return (
        <Dialog 
            open={open}
            onClose={onClose}
            aria-labelledby="report-title"
        >
            <DialogTitle id="report-title">
                {`${competitor1} vs ${competitor2}${set.record === null ? '' : `: ${set.record}`}`}
            </DialogTitle>
            <DialogContent>
                <div style={contentStyle}>
                    <div>{competitor1}</div>
                    <div>{competitor2}</div>
                    <input id="competitor-1-wins" type="number" step="1" disabled={set.record === null ? false : true} />
                    <input id="competitor-2-wins" type="number" step="1" disabled={set.record === null ? false : true} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="primary" disabled={set.record === null ? false : true}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}