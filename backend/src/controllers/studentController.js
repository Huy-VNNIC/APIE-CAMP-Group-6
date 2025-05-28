const db = require('../config/db');

module.exports = {
  // Lấy dashboard data
  getDashboard: async (req, res) => {
    try {
      // Lấy thông tin user
      const users = await db.query(
        'SELECT id, name, email, role, verified FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Lấy dashboard_data từ bảng students
      const students = await db.query(
        'SELECT dashboard_data FROM students WHERE user_id = ?',
        [req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student not found' 
        });
      }
      
      // Parse dashboard_data
      let dashboardData = {};
      try {
        if (typeof students[0].dashboard_data === 'string') {
          dashboardData = JSON.parse(students[0].dashboard_data);
        } else {
          dashboardData = students[0].dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = { progress: 0, level: 1, points: 0, completed_resources: 0 };
      }
      
      // Lấy danh sách tài liệu học tập từ bảng student_resources
      const resources = await db.query(
        `SELECT sr.resource_id as id, lr.title, lr.type, lr.language, sr.status, sr.last_accessed
         FROM student_resources sr
         JOIN learning_resources lr ON sr.resource_id = lr.id
         WHERE sr.student_id = ?
         ORDER BY sr.last_accessed DESC
         LIMIT 3`,
        [req.user.id]
      );
      
      // Biến đổi thành enrolledCourses
      const enrolledCourses = resources.map(resource => {
        // Tính progress dựa trên status
        let progress = 0;
        switch(resource.status) {
          case 'viewed':
            progress = 30;
            break;
          case 'in_progress':
            progress = 60;
            break;
          case 'completed':
            progress = 100;
            break;
        }
        
        return {
          id: resource.id,
          title: resource.title,
          description: `${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} content in ${resource.language}`,
          progress: progress,
          last_accessed: resource.last_accessed,
          status: resource.status
        };
      });
      
      // Lấy hoạt động gần đây từ bảng student_resources
      const activities = await db.query(
        `SELECT sr.id, sr.status, sr.last_accessed as timestamp,
         lr.title as resource_title, lr.type as resource_type
         FROM student_resources sr
         JOIN learning_resources lr ON sr.resource_id = lr.id
         WHERE sr.student_id = ?
         ORDER BY sr.last_accessed DESC
         LIMIT 3`,
        [req.user.id]
      );
      
      // Biến đổi thành recentActivities
      const recentActivities = activities.map(activity => {
        let activityType = '';
        let description = '';
        
        switch(activity.status) {
          case 'viewed':
            activityType = 'course_access';
            description = `Started viewing "${activity.resource_title}"`;
            break;
          case 'in_progress':
            activityType = 'course_progress';
            description = `Made progress in "${activity.resource_title}"`;
            break;
          case 'completed':
            activityType = 'course_completion';
            description = `Completed "${activity.resource_title}"`;
            break;
        }
        
        return {
          id: activity.id,
          type: activityType,
          description: description,
          timestamp: activity.timestamp
        };
      });
      
      // Trả về dữ liệu dashboard
      return res.json({
        success: true,
        data: {
          dashboardData,
          enrolledCourses,
          recentActivities,
          user: {
            name: users[0].name,
            email: users[0].email,
            login: 'Huy-VNNIC',
          }
        }
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching dashboard data',
        error: err.message
      });
    }
  },
  
  // Lấy profile
  getProfile: async (req, res) => {
    try {
      // Lấy thông tin user và student
      const userProfile = await db.query(
        `SELECT u.id, u.name, u.email, u.role, u.verified, u.created_at, s.dashboard_data
         FROM users u
         JOIN students s ON u.id = s.user_id
         WHERE u.id = ?`,
        [req.user.id]
      );
      
      if (userProfile.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
      
      const profile = userProfile[0];
      
      // Parse dashboard_data
      let dashboardData = {};
      try {
        if (typeof profile.dashboard_data === 'string') {
          dashboardData = JSON.parse(profile.dashboard_data);
        } else {
          dashboardData = profile.dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = { 
          progress: 0, 
          level: 1, 
          points: 0, 
          completed_resources: 0,
          preferences: {
            theme: 'light',
            language: 'en',
            emailNotifications: true,
            editor: {
              fontSize: 14,
              theme: 'monokai'
            }
          }
        };
      }
      
      // Trả về thông tin profile
      return res.json({
        success: true,
        data: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          verified: profile.verified === 1,
          login: 'Huy-VNNIC',
          created_at: profile.created_at,
          dashboard_data: dashboardData
        }
      });
    } catch (err) {
      console.error('Get profile error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching profile',
        error: err.message
      });
    }
  },
  
  // Cập nhật profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }
      
      // Kiểm tra email đã tồn tại chưa (nếu thay đổi email)
      const currentUser = await db.query(
        'SELECT email FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (currentUser.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (email !== currentUser[0].email) {
        const existingEmail = await db.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, req.user.id]
        );
        
        if (existingEmail.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'Email is already in use'
          });
        }
      }
      
      // Cập nhật thông tin user
      await db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, req.user.id]
      );
      
      // Trả về kết quả
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          name,
          email,
          login: 'Huy-VNNIC'
        }
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating profile',
        error: err.message
      });
    }
  },
  
  // Cập nhật preferences
  updatePreferences: async (req, res) => {
    try {
      const preferences = req.body;
      
      // Lấy dashboard_data hiện tại
      const students = await db.query(
        'SELECT dashboard_data FROM students WHERE user_id = ?',
        [req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Parse dashboard_data
      let dashboardData = {};
      try {
        if (typeof students[0].dashboard_data === 'string') {
          dashboardData = JSON.parse(students[0].dashboard_data);
        } else {
          dashboardData = students[0].dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = { progress: 0, level: 1, points: 0, completed_resources: 0 };
      }
      
      // Cập nhật preferences
      dashboardData.preferences = {
        ...(dashboardData.preferences || {}),
        ...preferences
      };
      
      // Lưu vào database
      await db.query(
        'UPDATE students SET dashboard_data = ? WHERE user_id = ?',
        [JSON.stringify(dashboardData), req.user.id]
      );
      
      // Trả về kết quả
      return res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: preferences
      });
    } catch (err) {
      console.error('Update preferences error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating preferences',
        error: err.message
      });
    }
  },
  
  // Cập nhật tiến độ resource
  updateResourceProgress: async (req, res) => {
    try {
      const { resourceId, status } = req.body;
      
      if (!resourceId || !status || !['viewed', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid resource ID or status'
        });
      }
      
      // Kiểm tra resource có tồn tại không
      const resources = await db.query(
        'SELECT id FROM learning_resources WHERE id = ?',
        [resourceId]
      );
      
      if (resources.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Kiểm tra xem đã có bản ghi trong student_resources chưa
      const existingRecords = await db.query(
        'SELECT id, status FROM student_resources WHERE student_id = ? AND resource_id = ?',
        [req.user.id, resourceId]
      );
      
      if (existingRecords.length > 0) {
        // Cập nhật bản ghi hiện có
        await db.query(
          'UPDATE student_resources SET status = ?, last_accessed = NOW() WHERE id = ?',
          [status, existingRecords[0].id]
        );
      } else {
        // Thêm bản ghi mới
        await db.query(
          'INSERT INTO student_resources (student_id, resource_id, status, last_accessed) VALUES (?, ?, ?, NOW())',
          [req.user.id, resourceId, status]
        );
      }
      
      // Cập nhật dashboard_data
      const completedCount = await db.query(
        `SELECT COUNT(*) as count FROM student_resources 
         WHERE student_id = ? AND status = 'completed'`,
        [req.user.id]
      );
      
      const totalResources = await db.query(
        `SELECT COUNT(*) as count FROM learning_resources`
      );
      
      // Lấy dashboard_data hiện tại
      const students = await db.query(
        'SELECT dashboard_data FROM students WHERE user_id = ?',
        [req.user.id]
      );
      
      let dashboardData = {};
      try {
        if (students.length > 0) {
          if (typeof students[0].dashboard_data === 'string') {
            dashboardData = JSON.parse(students[0].dashboard_data);
          } else {
            dashboardData = students[0].dashboard_data || {};
          }
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
      }
      
      // Cập nhật dashboard_data
      if (completedCount.length > 0 && totalResources.length > 0) {
        const completed = completedCount[0].count;
        const total = totalResources[0].count || 1;
        
        dashboardData.completed_resources = completed;
        dashboardData.progress = Math.min(Math.round((completed / total) * 100), 100);
        dashboardData.points = (dashboardData.points || 0) + (status === 'completed' ? 50 : 10);
        dashboardData.level = Math.floor((dashboardData.points || 0) / 250) + 1;
        
        // Lưu vào database
        await db.query(
          'UPDATE students SET dashboard_data = ? WHERE user_id = ?',
          [JSON.stringify(dashboardData), req.user.id]
        );
      }
      
      // Trả về kết quả
      return res.json({
        success: true,
        message: 'Resource progress updated successfully',
        data: {
          resourceId,
          status,
          dashboardData
        }
      });
    } catch (err) {
      console.error('Update resource progress error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating resource progress',
        error: err.message
      });
    }
  },
  
  // Lấy tiến độ học tập tổng quan
  getProgress: async (req, res) => {
    try {
      // Lấy dashboard_data
      const students = await db.query(
        'SELECT dashboard_data FROM students WHERE user_id = ?',
        [req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Parse dashboard_data
      let dashboardData = {};
      try {
        if (typeof students[0].dashboard_data === 'string') {
          dashboardData = JSON.parse(students[0].dashboard_data);
        } else {
          dashboardData = students[0].dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = { progress: 0, level: 1, points: 0, completed_resources: 0 };
      }
      
      // Lấy số lượng resource theo trạng thái
      const resourceStats = await db.query(
        `SELECT status, COUNT(*) as count FROM student_resources 
         WHERE student_id = ? GROUP BY status`,
        [req.user.id]
      );
      
      const stats = {
        viewed: 0,
        in_progress: 0,
        completed: 0
      };
      
      resourceStats.forEach(stat => {
        if (stat.status && stats.hasOwnProperty(stat.status)) {
          stats[stat.status] = stat.count;
        }
      });
      
      // Lấy thống kê submissions
      const submissionStats = await db.query(
        `SELECT status, COUNT(*) as count FROM student_submissions 
         WHERE student_id = ? GROUP BY status`,
        [req.user.id]
      );
      
      const submissionCounts = {
        pending: 0,
        success: 0,
        failed: 0
      };
      
      submissionStats.forEach(stat => {
        if (stat.status && submissionCounts.hasOwnProperty(stat.status)) {
          submissionCounts[stat.status] = stat.count;
        }
      });
      
      // Trả về dữ liệu tiến độ
      return res.json({
        success: true,
        data: {
          overall: {
            progress: dashboardData.progress || 0,
            level: dashboardData.level || 1,
            points: dashboardData.points || 0,
            completed_resources: dashboardData.completed_resources || 0
          },
          resources: stats,
          submissions: submissionCounts
        }
      });
    } catch (err) {
      console.error('Get progress error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching progress',
        error: err.message
      });
    }
  },
  
  // Lấy hoạt động gần đây
  getRecentActivities: async (req, res) => {
    try {
      // Lấy hoạt động từ student_resources
      const resourceActivities = await db.query(
        `SELECT 'resource' as type, sr.id, sr.status, sr.last_accessed as timestamp,
         lr.title as title, lr.type as resource_type
         FROM student_resources sr
         JOIN learning_resources lr ON sr.resource_id = lr.id
         WHERE sr.student_id = ?
         ORDER BY sr.last_accessed DESC
         LIMIT 5`,
        [req.user.id]
      );
      
      // Lấy hoạt động từ student_submissions
      const submissionActivities = await db.query(
        `SELECT 'submission' as type, ss.id, ss.status, ss.submitted_at as timestamp,
         lr.title as title
         FROM student_submissions ss
         JOIN learning_resources lr ON ss.resource_id = lr.id
         WHERE ss.student_id = ?
         ORDER BY ss.submitted_at DESC
         LIMIT 5`,
        [req.user.id]
      );
      
      // Kết hợp và sắp xếp các hoạt động
      const allActivities = [...resourceActivities, ...submissionActivities]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
      
      // Biến đổi dữ liệu thành recentActivities
      const activities = allActivities.map(activity => {
        let activityType = '';
        let description = '';
        
        if (activity.type === 'resource') {
          switch(activity.status) {
            case 'viewed':
              activityType = 'course_access';
              description = `Started viewing "${activity.title}"`;
              break;
            case 'in_progress':
              activityType = 'course_progress';
              description = `Made progress in "${activity.title}"`;
              break;
            case 'completed':
              activityType = 'course_completion';
              description = `Completed "${activity.title}"`;
              break;
          }
        } else {
          switch(activity.status) {
            case 'pending':
              activityType = 'assignment_submission';
              description = `Submitted assignment for "${activity.title}"`;
              break;
            case 'success':
              activityType = 'assignment_success';
              description = `Successfully completed assignment for "${activity.title}"`;
              break;
            case 'failed':
              activityType = 'assignment_failed';
              description = `Failed assignment for "${activity.title}"`;
              break;
          }
        }
        
        return {
          id: activity.id,
          type: activityType,
          description,
          timestamp: activity.timestamp
        };
      });
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: activities
      });
    } catch (err) {
      console.error('Get recent activities error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching recent activities',
        error: err.message
      });
    }
  },
  
  // Lấy danh sách tài liệu đã hoàn thành
  getCompletedResources: async (req, res) => {
    try {
      // Lấy danh sách resource đã hoàn thành
      const completedResources = await db.query(
        `SELECT sr.resource_id as id, lr.title, lr.type, lr.language, sr.last_accessed
         FROM student_resources sr
         JOIN learning_resources lr ON sr.resource_id = lr.id
         WHERE sr.student_id = ? AND sr.status = 'completed'
         ORDER BY sr.last_accessed DESC`,
        [req.user.id]
      );
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: completedResources
      });
    } catch (err) {
      console.error('Get completed resources error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching completed resources',
        error: err.message
      });
    }
  }
};