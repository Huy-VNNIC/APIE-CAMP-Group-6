// Thêm useTranslation hook
import { useTranslation } from 'react-i18next';

const CodeRunner = ({ resourceId = null, courseId = null, submissionId = null }) => {
  const { t } = useTranslation(); // Thêm hook useTranslation
  const { token } = useContext(UserContext);
  // ... rest of the component

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{t('code_playground.title')}</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="language-select-label">{t('code_playground.language')}</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            label={t('code_playground.language')}
            onChange={handleLanguageChange}
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label={t('code_playground.editor')} />
        <Tab label={t('code_playground.results')} />
        {previousSubmissions.length > 0 && <Tab label={t('code_playground.previous_submissions')} />}
      </Tabs>
      
      {/* ... rest of the JSX */}
      
      <Button 
        variant="contained" 
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={handleRunCode}
        disabled={loading || !code}
      >
        {loading ? <CircularProgress size={24} /> : t('code_playground.run_code')}
      </Button>
      
      {/* ... rest of the JSX */}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {t(`messages.${snackbar.message === 'Code đã được chạy thành công!' 
            ? 'code_run_success' 
            : snackbar.message === 'Lỗi khi chạy code!' 
            ? 'code_run_error'
            : snackbar.message === 'Nộp bài thành công!'
            ? 'submission_success'
            : 'submission_error'}`)}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
