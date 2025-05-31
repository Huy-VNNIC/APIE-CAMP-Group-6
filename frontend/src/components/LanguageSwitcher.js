import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        aria-label="language selector"
        size="small"
      >
        <ToggleButton value="vi" aria-label="Vietnamese">
          VI
        </ToggleButton>
        <ToggleButton value="en" aria-label="English">
          EN
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageSwitcher;
