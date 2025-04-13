import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

const SocialLinksNavbar = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <GitHubIcon />,
      url: 'https://github.com/Harith-Y',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      url: 'https://www.linkedin.com/in/harith-yerragolam-617486288/',
      color: '#0077b5'
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon />,
      url: 'https://instagram.com/disturbed_harshness',
      color: '#e4405f'
    },
    {
      name: 'Email',
      icon: <EmailIcon />,
      url: 'mailto:yharith16@gmail.com',
      color: '#4285f4'
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        zIndex: 1000
      }}
    >
      {socialLinks.map((link) => (
        <Tooltip key={link.name} title={link.name}>
          <IconButton
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: link.color,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            {link.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default SocialLinksNavbar; 