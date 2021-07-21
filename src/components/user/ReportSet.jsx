import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ReportSet({open, onClose, submit, set, setShowReport}) {

    const competitor1 = set.competitors[0].tag;
    const competitor2 = set.competitors[1] ? set.competitors[1].tag : 'buy';

    const contentStyle = {
        display: 'grid', 
        width: '500px',
        gridTemplateColumns: 'repeat(2, 50%)', 
        justifyItems: 'center',
    };

    const onSubmit = () => {
        const c1Wins = document.getElementById('competitor-1-wins').value;
        const c2Wins = document.getElementById('competitor-2-wins').value;

        const c1Id = set.competitors[0].id;
        
        if (set.competitors.length > 1) {
            const c2Id = set.competitors[1].id;
            const c1Won = c1Wins > c2Wins;
            c1Won ? submit(set, c1Id, c1Wins, c2Wins, setShowReport) : submit(set, c2Id, c2Wins, c1Wins, setShowReport);
        } else {
            submit(set, c1Id, c1Wins, 0, setShowReport);
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
                    <ReportSetInput 
                        competitorNumber={1}
                        record={set.record}
                        winner={set.winner}
                        competitorTag={competitor1}
                    />
                    <ReportSetInput 
                        competitorNumber={2}
                        record={set.record}
                        winner={set.winner}
                        competitorTag={competitor2}
                    />
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

function ReportSetInput({competitorNumber, record, winner, competitorTag}) {
    const id = competitorNumber === 1 ? 'competitor-1-wins' : 'competitor-2-wins';
    const type = 'number';
    const step = '1';
    const disabled = record === null ? false : true;

    if (winner) {
        const value = competitorTag === winner.tag ? record.substring(0, 1) : record.substring(2);
        return (
            <input 
                id={id} 
                type={type}
                step={step}
                disabled={disabled}
                value={value}
            />
        );
    } else {
        return (
            <input 
                id={id} 
                type={type}
                step={step}
                disabled={disabled}
            />
        );
    }
}