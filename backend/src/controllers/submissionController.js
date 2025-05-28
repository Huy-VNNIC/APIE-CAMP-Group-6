const SubmissionModel = require('../models/submissionModel');
const ResourceModel = require('../models/resourceModel');
const codeExecutionService = require('../services/codeExecutionService');
const { formatResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Submit code for execution
 */
const submitCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceId, code, language } = req.body;
    
    // Verify resource exists
    const resource = await ResourceModel.getById(resourceId);
    
    if (!resource) {
      return res.status(404).json(formatResponse(false, 'Resource not found'));
    }
    
    // Create submission with pending status
    const submission = await SubmissionModel.create({
      student_id: userId,
      resource_id: resourceId,
      code,
      result: '',
      status: 'pending'
    });
    
    // Execute code (asynchronously)
    const executeAndUpdateResult = async () => {
      try {
        // Get test cases (in a real app, these would be stored in the database)
        const testCases = [
          { input: '5', expectedOutput: '25' },
          { input: '10', expectedOutput: '100' }
        ];
        
        // Execute code
        const executionResult = await codeExecutionService.executeCode(code, language, testCases);
        
        // Update submission with result
        const status = executionResult.success ? 'success' : 'failed';
        await SubmissionModel.updateStatus(
          submission.id,
          status,
          JSON.stringify(executionResult)
        );
        
        logger.info(`Code execution completed for submission ${submission.id}: ${status}`);
      } catch (execError) {
        logger.error(`Code execution error for submission ${submission.id}:`, execError);
        
        // Update submission with error
        await SubmissionModel.updateStatus(
          submission.id,
          'failed',
          JSON.stringify({ error: 'Execution failed' })
        );
      }
    };
    
    // Start execution in background
    executeAndUpdateResult();
    
    return res.status(201).json(formatResponse(true, 'Code submitted successfully', {
      submissionId: submission.id,
      status: 'pending',
      message: 'Your code is being processed. Check back soon for results.'
    }));
  } catch (error) {
    logger.error('Error submitting code:', error);
    return res.status(500).json(formatResponse(false, 'Code submission failed'));
  }
};

/**
 * Get submission status
 */
const getSubmissionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const submission = await SubmissionModel.getById(id);
    
    if (!submission) {
      return res.status(404).json(formatResponse(false, 'Submission not found'));
    }
    
    // Check if submission belongs to current user
    if (submission.student_id !== userId) {
      return res.status(403).json(formatResponse(false, 'Access denied'));
    }
    
    return res.json(formatResponse(true, 'Submission retrieved successfully', submission));
  } catch (error) {
    logger.error('Error getting submission status:', error);
    return res.status(500).json(formatResponse(false, 'Failed to retrieve submission'));
  }
};

/**
 * Get all submissions for a student
 */
const getStudentSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const submissions = await SubmissionModel.getByStudentId(userId);
    
    return res.json(formatResponse(true, 'Submissions retrieved successfully', submissions));
  } catch (error) {
    logger.error('Error getting student submissions:', error);
    return res.status(500).json(formatResponse(false, 'Failed to retrieve submissions'));
  }
};

/**
 * Get submissions for a specific resource
 */
const getResourceSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceId } = req.params;
    
    const submissions = await SubmissionModel.getByResourceId(userId, resourceId);
    
    return res.json(formatResponse(true, 'Resource submissions retrieved successfully', submissions));
  } catch (error) {
    logger.error('Error getting resource submissions:', error);
    return res.status(500).json(formatResponse(false, 'Failed to retrieve resource submissions'));
  }
};

module.exports = {
  submitCode,
  getSubmissionStatus,
  getStudentSubmissions,
  getResourceSubmissions,
};