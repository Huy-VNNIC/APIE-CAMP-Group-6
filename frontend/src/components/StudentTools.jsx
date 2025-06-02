import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  Badge,
  Divider,
  CircularProgress
} from '@mui/material';

// Icons
import PanToolIcon from '@mui/icons-material/PanTool';
import HelpIcon from '@mui/icons-material/Help';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const StudentTools = () => {
  const [handRaised, setHandRaised] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState('');
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [openBookmarksDialog, setOpenBookmarksDialog] = useState(false);
  
  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    // In a real app, this would notify the instructor
    
    // Auto-lower hand after 30 seconds
    if (!handRaised) {
      setTimeout(() => {
        setHandRaised(false);
      }, 30000);
    }
  };
  
  const handleSendQuestion = () => {
    if (!question.trim()) return;
    
    setSending(true);
    
    // Simulate sending question to instructor
    setTimeout(() => {
      setSending(false);
      setOpenQuestionDialog(false);
      setQuestion('');
      alert('Your question has been sent to the instructor!');
    }, 1000);
  };
  
  const handleReaction = (reaction) => {
    // In a real app, this would send the reaction to the instructor
    alert(`You reacted with: ${reaction}`);
  };
  
  const handleAddBookmark = () => {
    const timestamp = new Date().toLocaleTimeString();
    setBookmarks([
      ...bookmarks, 
      { 
        id: Date.now(),
        timestamp,
        label: `Bookmark at ${timestamp}`,
        note: 'Click to add notes about this bookmark'
      }
    ]);
    
    alert('Bookmark added! You can access it later for reference.');
  };
  
  const handleSaveNotes = () => {
    // In a real app, this would save notes to the server
    setOpenNotesDialog(false);
    alert('Your notes have been saved!');
  };
  
  const handleDownloadResources = () => {
    // In a real app, this would download actual resources
    alert('Session resources downloaded successfully!');
  };
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Student Tools
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleRaiseHand}>
            <ListItemIcon>
              <Badge color="error" variant={handRaised ? "dot" : "standard"}>
                <PanToolIcon color={handRaised ? "primary" : "action"} />
              </Badge>
            </ListItemIcon>
            <ListItemText 
              primary={handRaised ? "Lower Hand" : "Raise Hand"} 
              secondary={handRaised ? "Instructor notified" : "Get instructor's attention"}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenQuestionDialog(true)}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Ask a Question" 
              secondary="Submit a question to the instructor"
            />
          </ListItemButton>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem>
          <ListItemText primary="Quick Reactions" />
        </ListItem>
        
        <ListItem sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip title="I understand">
            <IconButton onClick={() => handleReaction('understand')}>
              <ThumbUpIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="I'm confused">
            <IconButton onClick={() => handleReaction('confused')}>
              <ThumbDownIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Too slow">
            <IconButton onClick={() => handleReaction('slow')}>
              <SentimentVerySatisfiedIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Too fast">
            <IconButton onClick={() => handleReaction('fast')}>
              <SentimentVeryDissatisfiedIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleAddBookmark}>
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Add Bookmark" 
              secondary="Mark current point in session"
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenNotesDialog(true)}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Session Notes" 
              secondary="Take notes during the session"
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenBookmarksDialog(true)}>
            <ListItemIcon>
              <Badge badgeContent={bookmarks.length} color="primary">
                <BookmarkIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText 
              primary="View Bookmarks" 
              secondary={`${bookmarks.length} bookmarks saved`}
            />
          </ListItemButton>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleDownloadResources}>
            <ListItemIcon>
              <FileDownloadIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Download Resources" 
              secondary="Get session materials"
            />
          </ListItemButton>
        </ListItem>
      </List>
      
      {/* Ask Question Dialog */}
      <Dialog 
        open={openQuestionDialog} 
        onClose={() => setOpenQuestionDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Ask a Question</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your question will be sent to the instructor. They may answer it privately or share with the class.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Question"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSendQuestion} 
            variant="contained" 
            disabled={!question.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : null}
          >
            {sending ? 'Sending...' : 'Send Question'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notes Dialog */}
      <Dialog 
        open={openNotesDialog} 
        onClose={() => setOpenNotesDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Session Notes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Take notes during the session. These notes are only visible to you and will be saved for future reference.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Notes"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotesDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bookmarks Dialog */}
      <Dialog 
        open={openBookmarksDialog} 
        onClose={() => setOpenBookmarksDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Your Bookmarks</DialogTitle>
        <DialogContent>
          {bookmarks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No bookmarks saved yet. Use the "Add Bookmark" button during the session to mark important points.
            </Typography>
          ) : (
            <List>
              {bookmarks.map((bookmark) => (
                <ListItem key={bookmark.id}>
                  <ListItemIcon>
                    <BookmarkIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={bookmark.label} 
                    secondary={bookmark.note}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookmarksDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentTools;
