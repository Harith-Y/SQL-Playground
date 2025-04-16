import React from 'react';
import { Box, Typography, Paper, Container, Button, List, ListItem, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import SocialLinksNavbar from './SocialLinksNavbar';

const Contribute = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: isMobile ? 2 : 4,
        pb: isMobile ? 6 : 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: isMobile ? 2 : 3 }}>
        <Paper
          elevation={24}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom align="center">
            Contribute to SQL Playground
          </Typography>
          
          <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<GitHubIcon />}
              href="https://github.com/Harith-Y/SQL-Playground"
              target="_blank"
              rel="noopener noreferrer"
              size={isMobile ? "small" : "medium"}
            >
              View on GitHub
            </Button>
          </Box>

          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            How to Contribute
          </Typography>
          
          <List sx={{ width: '100%' }}>
            <ListItem>
              <ListItemText
                primary="1. Fork the Repository"
                secondary="Click the 'Fork' button on the GitHub repository to create your copy."
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="2. Clone Your Fork"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <code style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>git clone https://github.com/your-username/SQL-Playground.git</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard('git clone https://github.com/your-username/SQL-Playground.git')}
                    >
                      Copy
                    </Button>
                  </Box>
                }
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="3. Install Dependencies"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <code style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>npm install</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard('npm install')}
                    >
                      Copy
                    </Button>
                  </Box>
                }
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="4. Create a New Branch"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <code style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>git checkout -b feature/your-feature-name</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard('git checkout -b feature/your-feature-name')}
                    >
                      Copy
                    </Button>
                  </Box>
                }
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="5. Make Your Changes"
                secondary="Implement your feature or fix bugs."
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="6. Commit Your Changes"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <code style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>git commit -m "Description of your changes"</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard('git commit -m "Description of your changes"')}
                    >
                      Copy
                    </Button>
                  </Box>
                }
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="7. Push to Your Fork"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <code style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>git push origin feature/your-feature-name</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard('git push origin feature/your-feature-name')}
                    >
                      Copy
                    </Button>
                  </Box>
                }
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="8. Create a Pull Request"
                secondary="Go to your fork on GitHub and click 'New Pull Request' to submit your changes."
                primaryTypographyProps={{ variant: isMobile ? "body1" : "h6" }}
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              size={isMobile ? "small" : "medium"}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
      <SocialLinksNavbar />
    </Box>
  );
};

export default Contribute; 