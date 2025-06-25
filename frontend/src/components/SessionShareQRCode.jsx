import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  TextField, 
  Snackbar, 
  Alert,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import QrCode from '@mui/icons-material/QrCode'; // Removed unused import

const SessionShareQRCode = ({ sessionId, password, title }) => {
  const [copied, setCopied] = useState({
    url: false,
    id: false,
    password: false,
    invite: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Generate direct access URL and invitation URL
  // const sessionUrl = `${window.location.origin}/live-session/${sessionId}`; // Commented out unused variable
  const inviteUrl = `${window.location.origin}/invite?session=${sessionId}${password ? `&password=${password}` : ''}`;
  
  // Generate QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inviteUrl)}`;

  // Helper function for clipboard operations with fallback
  const copyToClipboard = async (text, type) => {
    try {
      // Try to focus the document first
      if (document.hasFocus && !document.hasFocus()) {
        window.focus();
      }
      
      // Modern clipboard API
      await navigator.clipboard.writeText(text);
      
      // Show success state
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Copied to clipboard!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      
      // Fallback method for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Make it invisible but accessible
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        
        if (successful) {
          setCopied({ ...copied, [type]: true });
          setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
          setSnackbar({
            open: true,
            message: 'Copied to clipboard!',
            severity: 'success'
          });
        } else {
          throw new Error('Copy command failed');
        }
        
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        // Show the text so user can manually copy it
        setSnackbar({
          open: true,
          message: 'Please select the text and copy it manually',
          severity: 'info'
        });
      }
    }
  };

  const handleCopySessionId = () => copyToClipboard(sessionId, 'id');
  const handleCopyPassword = () => copyToClipboard(password, 'password');
  const handleCopyUrl = () => copyToClipboard(inviteUrl, 'url');
  
  const handleInviteLink = () => {
    // Create invite message with or without password
    let inviteText = `Join my ${title || 'live coding'} session!\n\n`;
    inviteText += `Direct link: ${inviteUrl}\n\n`;
    inviteText += `Or join manually with:\nSession ID: ${sessionId}`;
    if (password) {
      inviteText += `\nPassword: ${password}`;
    }
    
    copyToClipboard(inviteText, 'invite');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper sx={{ p: 3, textAlign: 'center', mx: 'auto', my: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Share Session
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Complete Invite Message
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleInviteLink}
              startIcon={copied.invite ? <CheckCircleIcon /> : <ContentCopyIcon />}
              fullWidth
              color={copied.invite ? "success" : "primary"}
            >
              {copied.invite ? "Copied!" : "Copy Invite Message"}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Creates a complete message with URL, ID, and password
            </Typography>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Direct Invite Link
          </Typography>
          <TextField
            value={inviteUrl}
            fullWidth
            variant="outlined"
            margin="dense"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleCopyUrl}
                    edge="end"
                    color={copied.url ? "success" : "default"}
                  >
                    {copied.url ? <CheckCircleIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Session ID
            </Typography>
            <TextField
              value={sessionId}
              fullWidth
              variant="outlined"
              margin="dense"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleCopySessionId}
                      edge="end"
                      color={copied.id ? "success" : "default"}
                    >
                      {copied.id ? <CheckCircleIcon /> : <ContentCopyIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {password && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Session Password
              </Typography>
              <TextField
                value={password}
                fullWidth
                variant="outlined"
                margin="dense"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleCopyPassword}
                        edge="end"
                        color={copied.password ? "success" : "default"}
                      >
                        {copied.password ? <CheckCircleIcon /> : <ContentCopyIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center', 
            height: '100%' 
          }}>
            <Typography variant="subtitle2" gutterBottom>
              QR Code
            </Typography>
            
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              p: 2, 
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#fff'
            }}>
              <img src={qrCodeUrl} alt="Session QR Code" style={{ maxWidth: '100%' }} />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              Scan to join the session directly
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
        Students can join by scanning the QR code, using the direct invite link, 
        or by entering the Session ID and Password on the Live Sessions page.
      </Typography>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SessionShareQRCode;
