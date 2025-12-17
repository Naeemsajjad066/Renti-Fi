# Complaint/Report Management System

## Overview
A comprehensive complaint management system that allows users to report properties and enables administrators to review, prioritize, and resolve complaints efficiently.

## Features

### User Features
1. **Report Property**
   - Accessible from property details page via "Report" button
   - Complaint categories:
     - False Information
     - Safety Concerns
     - Inappropriate Content
     - Scam/Fraud
     - Property Condition
     - Host Behavior
     - Other
   
2. **Complaint Submission**
   - Required fields: Title, Description, Category
   - Optional: Up to 5 attachments (images/documents, max 5MB each)
   - Real-time character count (title: 200 max, description: 2000 max)
   - Minimum description length: 20 characters
   - Visual file preview before submission
   
3. **File Uploads**
   - Cloudinary integration for secure storage
   - Supported formats: Images (PNG, JPG) and PDF documents
   - Automatic file type detection
   - Preview functionality for images

### Admin Features
1. **Complaints Dashboard** (`/admin/complaints`)
   - Statistics overview cards:
     - Total complaints
     - Pending complaints
     - Under review
     - Resolved complaints
   
2. **Filtering & Search**
   - Search by title, description, or property name
   - Filter by status: Pending, Under Review, Resolved, Dismissed
   - Filter by priority: Low, Medium, High, Urgent
   
3. **Complaint Details** (`/admin/complaints/:id`)
   - Full complaint information
   - Property snapshot (title, location, price, host info)
   - Reporter information (name, email, phone)
   - Attached files with preview
   - Timeline of events
   
4. **Admin Actions**
   - Update complaint status
   - Set priority level
   - Add internal admin notes
   - Provide resolution details
   - Automatic tracking of reviewer and timestamps

## Database Schema

### Complaint Model
```javascript
{
  property: ObjectId (ref: Property),
  reporter: ObjectId (ref: User),
  title: String (required, max: 200),
  description: String (required, max: 2000),
  attachments: [{
    url: String,
    publicId: String,
    type: String (image/document)
  }],
  category: String (enum),
  status: String (pending/under_review/resolved/dismissed),
  priority: String (low/medium/high/urgent),
  adminNotes: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  resolution: String,
  resolvedAt: Date,
  propertySnapshot: {
    title: String,
    host: ObjectId,
    location: String,
    price: Number
  },
  timestamps: true
}
```

### Indexes
- `status` + `createdAt` (for listing)
- `property` (for property-specific queries)
- `reporter` (for user complaints)
- `status` + `priority` (for prioritized listing)

## API Endpoints

### User Routes
- `POST /api/complaints` - Submit a complaint (auth required)
- `GET /api/complaints/my-complaints` - Get user's complaints (auth required)

### Admin Routes (admin auth required)
- `GET /api/complaints/stats` - Get complaint statistics
- `GET /api/complaints` - Get all complaints with filtering
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint status/priority/notes

### Query Parameters
- `status` - Filter by status
- `priority` - Filter by priority
- `page` - Pagination (default: 1)
- `limit` - Items per page (default: 20)

## Email Notifications

### Admin Notification Email
Sent automatically when a complaint is submitted:
- Complaint title and category
- Description
- Property information
- Reporter information
- Number of attachments
- Direct link to review in admin panel

Recipient: `ADMIN_EMAIL` environment variable or `rentifi.project@gmail.com`

## UI Components

### 1. ReportPropertyModal
**Location:** `client/src/components/ReportPropertyModal.jsx`
- Modal form for submitting complaints
- File upload with drag-and-drop
- Real-time validation
- Success/error handling

### 2. AdminComplaints
**Location:** `client/src/pages/AdminComplaints.jsx`
- Complaints list view
- Statistics dashboard
- Search and filter functionality
- Click-through to details

### 3. ComplaintDetails
**Location:** `client/src/pages/ComplaintDetails.jsx`
- Full complaint view
- Property and reporter information
- Admin action panel
- Status and priority management
- Timeline view

## Routes Configuration

### App Routes
```jsx
// User accessible
/property/:id (with Report button)

// Admin only
/admin/complaints (list view)
/admin/complaints/:id (detail view)
```

### AdminPanel Integration
- Complaints tab with AlertTriangle icon
- Quick navigation to complaints management
- Shows as "Issues" in sidebar

## Status Workflow

1. **Pending** → Initial status when complaint is submitted
2. **Under Review** → Admin has started reviewing
3. **Resolved** → Issue has been addressed
4. **Dismissed** → Complaint deemed invalid/resolved differently

## Priority Levels

- **Low** - Minor issues, non-urgent
- **Medium** - Standard complaints (default)
- **High** - Serious issues requiring attention
- **Urgent** - Critical issues (safety, fraud)

## Color Coding

### Status Colors
- Pending: Yellow (`bg-yellow-100 text-yellow-800`)
- Under Review: Blue (`bg-blue-100 text-blue-800`)
- Resolved: Green (`bg-green-100 text-green-800`)
- Dismissed: Gray (`bg-gray-100 text-gray-800`)

### Priority Colors
- Low: Gray
- Medium: Blue
- High: Orange
- Urgent: Red

## Security Features

1. **Authentication Required**
   - Users must be logged in to submit complaints
   - Admin role required for management

2. **Data Validation**
   - Input sanitization (express-mongo-sanitize)
   - Character limits enforced
   - File size restrictions

3. **Property Snapshot**
   - Captures property state at time of complaint
   - Prevents data loss if property is deleted/modified

4. **Admin Audit Trail**
   - Tracks who reviewed the complaint
   - Timestamps for all status changes
   - Separate admin notes from public resolution

## Configuration

### Environment Variables
```env
ADMIN_EMAIL=admin@rentifi.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLIENT_URL=http://localhost:8080
```

### Cloudinary Setup
Upload preset: `rentifi_complaints`
Folder: `complaints`

## Usage Flow

### For Users
1. Browse to property details page
2. Click "Report" button (red flag icon)
3. Fill out complaint form with details
4. Optionally attach evidence (images/documents)
5. Submit complaint
6. Receive confirmation toast

### For Admins
1. Navigate to Admin Panel
2. Click "Issues" tab
3. View "View All Complaints" button
4. Navigate to complaints list
5. Filter/search as needed
6. Click on complaint to view details
7. Update status, priority, add notes
8. Provide resolution
9. Mark as resolved

## Future Enhancements

- [ ] Email notifications to reporters when status changes
- [ ] Complaint response system (admin → user communication)
- [ ] Bulk actions (resolve multiple, change priority)
- [ ] Advanced analytics and reporting
- [ ] Complaint trends by property/host
- [ ] Auto-flagging of repeat offenders
- [ ] Integration with property suspension system
- [ ] SMS notifications for urgent complaints
- [ ] Export complaints to CSV/PDF

## Testing Checklist

### User Testing
- [ ] Submit complaint with all fields
- [ ] Submit complaint with attachments
- [ ] Verify character limits work
- [ ] Test file upload (images and PDFs)
- [ ] Test file size validation (>5MB should fail)
- [ ] Verify success toast appears
- [ ] Check complaint appears in user's list

### Admin Testing
- [ ] View complaints list
- [ ] Test status filters
- [ ] Test priority filters
- [ ] Test search functionality
- [ ] View complaint details
- [ ] Update complaint status
- [ ] Change priority
- [ ] Add admin notes
- [ ] Add resolution
- [ ] Verify email sent to admin
- [ ] Check timestamps update correctly
- [ ] Verify reviewer info captured

## Troubleshooting

### Cloudinary Upload Fails
- Check CLOUDINARY_CLOUD_NAME is set
- Verify upload preset `rentifi_complaints` exists
- Ensure folder permissions are correct

### Email Not Sent
- Verify ADMIN_EMAIL environment variable
- Check email service configuration
- Look for errors in server logs

### Complaints Not Showing
- Verify user authentication
- Check admin role assignment
- Inspect browser console for errors
- Verify API endpoints are accessible

## Code Locations

**Backend:**
- Model: `server/models/Complaint.js`
- Controller: `server/controllers/complaintController.js`
- Routes: `server/routes/complaints.js`

**Frontend:**
- Report Modal: `client/src/components/ReportPropertyModal.jsx`
- Admin List: `client/src/pages/AdminComplaints.jsx`
- Detail View: `client/src/pages/ComplaintDetails.jsx`
- Admin Panel: `client/src/components/AdminPanel.jsx` (updated)
- Routes: `client/src/App.tsx` (updated)
