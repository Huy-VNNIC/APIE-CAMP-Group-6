import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip
} from '@mui/material';

// Icons
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

// Sample messages data
const initialMessages = [
  {
    id: 1,
    sender: 'John Smith',
    role: 'instructor',
    text: 'Welcome to the live session! Feel free to ask questions.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isPrivate: false
  },
  {
    id: 2,
    sender: 'System',
    role: 'system',
    text: 'Jane Doe joined the session',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    isPrivate: false
  },
  {
    id: 3,
    sender: 'John Smith',
    role: 'instructor',
    text: 'Today we\'ll be covering functions in JavaScript. Let\'s start with the basics.',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    isPrivate: false
  },
  {
    id: 4,
    sender: 'Jane Doe',
    role: 'student',
    text: 'Can you explain the difference between arrow functions and regular functions?',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    isPrivate: false
  },
  {
    id: 5,
    sender: 'John Smith',
    role: 'instructor',
    text: 'Great question, Jane! Arrow functions have a shorter syntax and lexically bind the this value. Let me show an example...',
    timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    isPrivate: false
  }
];

// Sample participants data
const initialParticipants = [
  { id: 1, name: 'John Smith', role: 'instructor', status: 'online' },
  { id: 2, name: 'Jane Doe', role: 'student', status: 'online' },
  { id: 3, name: 'Alice Johnson', role: 'student', status: 'online' },
  { id: 4, name: 'Bob Williams', role: 'student', status: 'away' },
  { id: 5, name: 'Charlie Brown', role: 'student', status: 'online' }
];

const SessionChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [participants, setParticipants] = useState(initialParticipants);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [privateMode, setPrivateMode] = useState(false);
  const [privateRecipient, setPrivateRecipient] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: 'You',
      role: 'student',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isPrivate: privateMode
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // If in private mode, simulate instructor response
    if (privateMode && privateRecipient) {
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: privateRecipient.name,
          role: privateRecipient.role,
          text: `[Private] I got your message: "${newMessage.substring(0, 20)}${newMessage.length > 20 ? '...' : ''}"`,
          timestamp: new Date().toISOString(),
          isPrivate: true
        };
        
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleOpenMessageMenu = (event, message) => {
    setMessageMenuAnchor(event.currentTarget);
    setSelectedMessage(message);
  };
  
  const handleCloseMessageMenu = () => {
    setMessageMenuAnchor(null);
    setSelectedMessage(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleReplyPrivately = (participant) => {
    setPrivateMode(true);
    setPrivateRecipient(participant);
    setActiveTab(0); // Switch to chat tab
    
    // Focus the input field
    setTimeout(() => {
      document.getElementById('message-input').focus();
    }, 100);
  };
  
  const handleExitPrivateMode = () => {
    setPrivateMode(false);
    setPrivateRecipient(null);
  };
  
  const handleCopyMessage = () => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.text);
      alert('Message copied to clipboard!');
    }
    handleCloseMessageMenu();
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            icon={<SendIcon fontSize="small" />} 
            iconPosition="start"
            label="Chat" 
          />
          <Tab 
            icon={<PersonIcon fontSize="small" />} 
            iconPosition="start"
            label={`Participants (${participants.length})`} 
          />
        </Tabs>
      </Box>
      
      {/* Chat Tab */}
      <Box 
        sx={{ 
          display: activeTab === 0 ? 'flex' : 'none',
          flexDirection: 'column',
          flexGrow: 1,
          height: 0
        }}
      >
        {privateMode && (
          <Box sx={{ 
            p: 1, 
            bgcolor: 'info.light', 
            color: 'info.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2">
              Private message to {privateRecipient?.name}
            </Typography>
            <Button 
              size="small" 
              variant="outlined" 
              color="inherit" 
              onClick={handleExitPrivateMode}
            >
              Exit Private Mode
            </Button>
          </Box>
        )}
        
        {/* Messages List */}
        <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id} 
                alignItems="flex-start"
                sx={{ 
                  bgcolor: message.isPrivate ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                  borderRadius: 1
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={message.sender} src="">
                    {message.sender.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ fontWeight: message.role === 'instructor' ? 'bold' : 'normal' }}
                        >
                          {message.sender}
                        </Typography>
                        
                        {message.isPrivate && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, bgcolor: 'grey.200', px: 0.5, borderRadius: 0.5 }}
                          >
                            Private
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                        
                        <IconButton 
                          size="small"
                          onClick={(e) => handleOpenMessageMenu(e, message)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ 
                        display: 'inline',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {message.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        
        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            id="message-input"
            fullWidth
            placeholder={privateMode ? `Message ${privateRecipient?.name}...` : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            multiline
            maxRows={3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box>
                    <Tooltip title="Attach File">
                      <IconButton edge="end">
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Insert Emoji">
                      <IconButton edge="end">
                        <EmojiEmotionsIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton 
                      edge="end" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      
      {/* Participants Tab */}
      <Box 
        sx={{ 
          display: activeTab === 1 ? 'block' : 'none',
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <GroupIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Participants" 
              secondary={`${participants.length} people in this session`} 
            />
          </ListItem>
          
          <Divider component="li" />
          
          {participants.map((participant) => (
            <ListItem 
              key={participant.id}
              secondaryAction={
                participant.role !== 'instructor' && (
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleReplyPrivately(participant)}
                  >
                    Message
                  </Button>
                )
              }
            >
              <ListItemAvatar>
                <Avatar>
                  {participant.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">
                      {participant.name}
                    </Typography>
                    {participant.role === 'instructor' && (
                      <Typography
                        variant="caption"
                        sx={{ ml: 1, bgcolor: 'primary.main', color: 'white', px: 0.5, borderRadius: 0.5 }}
                      >
                        Instructor
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    color={participant.status === 'online' ? 'success.main' : 'text.secondary'}
                  >
                    {participant.status === 'online' ? 'Online' : 'Away'}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Message Menu */}
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={handleCloseMessageMenu}
      >
        <MenuItem onClick={handleCopyMessage}>Copy Message</MenuItem>
        {selectedMessage?.sender !== 'You' && (
          <MenuItem onClick={() => {
            const participant = participants.find(p => p.name === selectedMessage?.sender);
            if (participant) {
              handleReplyPrivately(participant);
            }
            handleCloseMessageMenu();
          }}>
            Reply Privately
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default SessionChat;
