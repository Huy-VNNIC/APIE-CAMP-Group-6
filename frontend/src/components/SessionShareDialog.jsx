import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import SessionShareQRCode from './SessionShareQRCode';

const SessionShareDialog = ({ open, onClose, sessionId, password, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Share Your Session</DialogTitle>
      
      <DialogContent>
        <SessionShareQRCode 
          sessionId={sessionId}
          password={password}
          title={title}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionShareDialog;
