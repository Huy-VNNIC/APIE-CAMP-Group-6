# Student API Documentation

## Code Execution API

### 1. Submit code and run in container

- **URL**: `/api/code/submit`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "resourceId": 1,
    "courseId": 1,
    "codeText": "console.log('Hello World!');",
    "language": "javascript"
  }
  ```

## Student Dashboard & Analytics API

### 1. Get Student Dashboard

- **URL**: `/api/students/dashboard`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Response**: Student dashboard data including course progress, recent quiz attempts, and active courses

### 2. Get Student Analytics

- **URL**: `/api/students/analytics`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Query Parameters**:
  - `courseId` (optional): Filter analytics by a specific course
- **Response**: Comprehensive student analytics including time spent, progress, quiz performance, etc.

## Learning Path & Recommendations API

### 1. Get Personalized Learning Path Recommendations

- **URL**: `/api/students/recommendations`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Response**: Personalized course and resource recommendations based on the student's performance and interests

## Peer Collaboration API

### 1. Find Potential Collaborators

- **URL**: `/api/students/collaborators/:courseId`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **URL Parameters**:
  - `courseId`: ID of the course to find collaborators for
- **Response**: List of students enrolled in the same course who are potential collaboration peers

### 2. Request Collaboration

- **URL**: `/api/students/collaboration`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "peerId": "123abc",
    "courseId": "456def",
    "topic": "Advanced Database Concepts",
    "description": "Looking to practice database normalization techniques",
    "scheduledTime": "2025-06-25T14:00:00Z"
  }
  ```
- **Response**: Collaboration request details

### 3. Get Collaboration Requests

- **URL**: `/api/students/collaboration/requests`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Response**: List of sent and received collaboration requests

### 4. Respond to Collaboration Request

- **URL**: `/api/students/collaboration/:requestId/respond`
- **Method**: `PUT`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **URL Parameters**:
  - `requestId`: ID of the collaboration request to respond to
- **Request Body**:
  ```json
  {
    "response": "accepted" // or "rejected"
  }
  ```
- **Response**: Updated collaboration request details

## Feedback System API

### 1. Submit Feedback

- **URL**: `/api/students/feedback`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "courseId": "456def",
    "content": "The course content was very well organized and presented clearly.",
    "rating": 4,
    "type": "course" // "course", "instructor", or "platform"
  }
  ```
- **Response**: Submitted feedback details

## Notification System API

### 1. Get Notifications

- **URL**: `/api/students/notifications`
- **Method**: `GET`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Response**: List of student notifications (deadlines, announcements, grades, etc.)

### 2. Mark Notification as Read

- **URL**: `/api/students/notifications/:notificationId/read`
- **Method**: `PUT`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **URL Parameters**:
  - `notificationId`: ID of the notification to mark as read
- **Response**: Confirmation message

## Activity Tracking API

### 1. Track Course Access

- **URL**: `/api/students/track/course`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "courseId": "456def",
    "lessonId": "789ghi" // optional
  }
  ```
- **Response**: Confirmation message

### 2. Track Lesson Time

- **URL**: `/api/students/track/lesson-time`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "courseId": "456def",
    "lessonId": "789ghi",
    "timeSpentSeconds": 300
  }
  ```
- **Response**: Confirmation message

### 3. Complete Lesson

- **URL**: `/api/students/track/complete-lesson`
- **Method**: `POST`
- **Authentication**: Requires Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "courseId": "456def",
    "lessonId": "789ghi"
  }
  ```
- **Response**: Confirmation message
