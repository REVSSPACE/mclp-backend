# MCLP Land Management System - Backend API

**Developed by Vethraa Ventures Pvt. Ltd.**  
*Business Solutions, Beyond Boundaries*

---

## 🚀 Features

- ✅ User Authentication (JWT-based)
- ✅ File/Project Management (CRUD operations)
- ✅ Account Management with Balance Tracking
- ✅ Document Upload/Download
- ✅ Project Status Workflow (New → Handling → Hold/Completed)
- ✅ Documentation Status Tracking (DWG, Forms, Online Upload)
- ✅ Secure file storage
- ✅ RESTful API architecture

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

---

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd mclp-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mclp-land-management

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=30d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Start MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo service mongod start
```

### 5. Run the server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@mclp.com",
  "password": "password123",
  "fullName": "Admin User"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Files/Projects

#### Get All Files
```
GET /api/files
Authorization: Bearer <token>

Query Parameters:
- projectStatus: new | handling | hold | completed
- category: Regular | Unapproved | Land Use | Misc | Single Plot | RERA
- district: string
```

#### Get Single File
```
GET /api/files/:id
Authorization: Bearer <token>
```

#### Create New File
```
POST /api/files
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Regular",
  "surveyNumber": "245/2A",
  "district": "Erode",
  "taluk": "Bhavani",
  "village": "Kumarapalayam",
  "extent": 2.5,
  "extentUnit": "Acres",
  "owners": [
    { "name": "Rajesh Kumar", "mobile": "9876543210" }
  ],
  "contactName": "Rajesh Kumar",
  "contactMobile": "9876543210",
  "mapLink": "https://maps.google.com",
  "notes": "Prime location"
}
```

#### Update File
```
PUT /api/files/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "surveyNumber": "245/2B",
  "extent": 3.0
}
```

#### Update Project Status
```
PUT /api/files/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectStatus": "handling"
}
```

#### Update Handling Status
```
PUT /api/files/:id/handling-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "fileStatus": "DTCP In Progress",
  "remarks": "Application submitted",
  "dwgStatus": "Completed",
  "formsStatus": "Submitted",
  "onlineStatus": "Under Verification"
}
```

#### Delete File
```
DELETE /api/files/:id
Authorization: Bearer <token>
```

#### Get Dashboard Stats
```
GET /api/files/stats/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalFiles": 10,
    "newProjects": 2,
    "handlingProjects": 5,
    "completedProjects": 3
  }
}
```

---

### Accounts

#### Get All Accounts
```
GET /api/accounts
Authorization: Bearer <token>

Query Parameters:
- category: Revenue | Expenses | Assets | Liabilities
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD

Response:
{
  "success": true,
  "count": 5,
  "summary": {
    "totalCredit": 1050000,
    "totalDebit": 515000,
    "balance": 535000
  },
  "data": [ ... ]
}
```

#### Create Account Entry
```
POST /api/accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-02-14",
  "itemName": "Land Purchase - Survey 245/2A",
  "category": "Expenses",
  "type": "Bank Transfer",
  "credit": 0,
  "debit": 5000000,
  "description": "Optional description"
}
```

#### Update Account Entry
```
PUT /api/accounts/:id
Authorization: Bearer <token>
```

#### Delete Account Entry
```
DELETE /api/accounts/:id
Authorization: Bearer <token>
```

#### Get Account Summary
```
GET /api/accounts/stats/summary
Authorization: Bearer <token>
```

---

### Documents

#### Get All Documents
```
GET /api/documents
Authorization: Bearer <token>

Query Parameters:
- category: company | govt-gos | govt-docs | templates
```

#### Upload Document
```
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: (binary file)
- category: company | govt-gos | govt-docs | templates
```

#### Download Document
```
GET /api/documents/download/:id
Authorization: Bearer <token>
```

#### Delete Document
```
DELETE /api/documents/:id
Authorization: Bearer <token>
```

---

## 🗂️ Project Structure

```
mclp-backend/
├── models/
│   ├── User.js          # User model with authentication
│   ├── File.js          # File/Project model
│   ├── Account.js       # Account/Transaction model
│   └── Document.js      # Document metadata model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── files.js         # File/Project routes
│   ├── accounts.js      # Account routes
│   └── documents.js     # Document upload/download routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── uploads/             # File storage directory
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- User-specific data isolation
- File type validation
- File size limits
- SQL injection prevention (MongoDB)
- CORS configuration

---

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Register a new user: `POST /api/auth/register`
3. Login: `POST /api/auth/login` (save the token)
4. Add token to Authorization header: `Bearer <your-token>`
5. Test all endpoints with the token

---

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mclp
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://yourdomain.com
```

### Deploy to Heroku
```bash
heroku create mclp-backend
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

### Deploy to Railway/Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

---

## 📞 Support

Developed by **Vethraa Ventures Pvt. Ltd.**  
For support, contact: [your-email@vethraaventures.com]

---

## 📄 License

Copyright © 2026 Vethraa Ventures Pvt. Ltd.
