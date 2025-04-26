
# MongoDB Integration Setup Instructions

## IMPORTANT: Security Notice
The MongoDB connection string contains sensitive credentials that should not be included directly in your frontend code. To properly connect to MongoDB, you need to set up a backend service.

## Option 1: Create a Separate Backend Service

1. Create a new directory for your backend:
```bash
mkdir internship-backend
cd internship-backend
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install the required dependencies:
```bash
npm install express mongoose cors dotenv
```

4. Create a `.env` file to store your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://internship:abcdefgh@cluster0.aoveouw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

5. Create the main server file `server.js`:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import your internship model
const InternshipModel = require('./models/internship.model');

// Routes
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await InternshipModel.find();
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/internships', async (req, res) => {
  try {
    const newInternship = new InternshipModel(req.body);
    const savedInternship = await newInternship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add more routes for updating, deleting, etc.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

6. Create a directory for models and add the internship model:
```bash
mkdir models
```

7. Create `models/internship.model.js` file with your schema:
```javascript
const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  academicYear: { type: String, required: true },

  companyName: { type: String, required: true },
  roleOffered: { type: String, required: true },
  stipend: { type: Number, required: true },
  durationMonths: { type: Number, required: true },

  hrDetails: {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true }
  },

  internshipDuration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },

  offerLetter: { type: String },
  nocByHOD: { type: String },
  studentLetterToHOD: { type: String },

  feedback: {
    company: { type: String },
    role: { type: String },
    feedbackText: { type: String },
    skillsUsed: { type: String },
    learningExperience: { type: String }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentInternship', internshipSchema);
```

8. Run your backend:
```bash
node server.js
```

## Option 2: Use the Lovable Supabase Integration

As an alternative, Lovable has a native integration with Supabase which provides:
- Database storage
- Authentication
- File storage
- Serverless functions

To use this integration:
1. Click on the green Supabase button in the top-right corner of the Lovable interface
2. Follow the prompts to connect to Supabase
3. Use Supabase's JavaScript client to interact with your data

## Frontend Integration

Once your backend is set up, use this code in your React application to connect to your API:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchInternships = async () => {
  const response = await axios.get(`${API_URL}/internships`);
  return response.data;
};

export const createInternship = async (internshipData) => {
  const response = await axios.post(`${API_URL}/internships`, internshipData);
  return response.data;
};

// Add more API functions as needed
```

Then use these functions in your components to interact with your MongoDB database through the API.
