// Mock data cho enrollments
const enrollments = [];

// @desc    Tạo enrollment mới
// @route   POST /api/enrollments
// @access  Private
exports.createEnrollment = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    
    // Kiểm tra thông tin
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }
    
    // Tạo enrollment mới
    const newEnrollment = {
      id: String(enrollments.length + 1),
      courseId,
      userId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progress: 0
    };
    
    // Thêm vào danh sách
    enrollments.push(newEnrollment);
    
    res.status(201).json({
      success: true,
      data: newEnrollment
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Lấy tất cả enrollments
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = async (req, res) => {
  try {
    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Lấy enrollment theo ID
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = enrollments.find(e => e.id === req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy enrollment'
      });
    }
    
    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cập nhật enrollment
// @route   PUT /api/enrollments/:id
// @access  Private
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollmentIndex = enrollments.findIndex(e => e.id === req.params.id);
    
    if (enrollmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy enrollment'
      });
    }
    
    const updatedEnrollment = {
      ...enrollments[enrollmentIndex],
      ...req.body,
      id: req.params.id // Đảm bảo ID không thay đổi
    };
    
    enrollments[enrollmentIndex] = updatedEnrollment;
    
    res.json({
      success: true,
      data: updatedEnrollment
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Xóa enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollmentIndex = enrollments.findIndex(e => e.id === req.params.id);
    
    if (enrollmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy enrollment'
      });
    }
    
    enrollments.splice(enrollmentIndex, 1);
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
