import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { chatbotAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: t('default_greeting', 'Hello! How can I help you today?'),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, loading, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotAPI.sendMessage(input);
      const botMessage: Message = {
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: t('error_message', 'Sorry, I encountered an error. Please try again.'),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 12, sm: 16 }, 
          right: { xs: 12, sm: 16 },
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 }
        }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
      </Fab>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h6"
              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
            >
              {t('property_assistant', 'Property Assistant')}
            </Typography>
            <IconButton 
              onClick={() => setOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent 
          dividers 
          sx={{ 
            height: { xs: 'calc(100vh - 180px)', sm: 400 },
            p: { xs: 1.5, sm: 2 }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    maxWidth: { xs: '85%', sm: '70%' },
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    border: message.sender !== 'user' ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      fontSize: { xs: '0.875rem', sm: '0.875rem' }
                    }}
                  >
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary'
                }}>
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                  >
                    {t('typing', 'Typing...')}
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: 1 }}>
          <TextField
            fullWidth
            placeholder={t('type_message', 'Type your message...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            size="small"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="small"
            sx={{
              minWidth: { xs: 70, sm: 90 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' }
            }}
          >
            {t('send', 'Send')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
