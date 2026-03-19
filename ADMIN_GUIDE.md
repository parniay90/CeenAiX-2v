# CeenAiX Admin Portal Guide

## Accessing the Admin Portal

The Admin Portal is the central hub for managing the entire CeenAiX healthcare platform.

### How to Access

1. **From Landing Page**: Click the "Admin" button in the top navigation bar
2. **Direct Navigation**: Use the navigation context `navigateToAdminPortal()` from anywhere in the app

### Admin Dashboard Features

#### 1. **Overview Statistics**
- **Total Patients** - Real-time patient count with growth percentage
- **Total Doctors** - Active healthcare providers on the platform
- **Total Appointments** - Scheduled and completed consultations
- **Total Revenue** - Platform earnings and financial metrics
- **Active Appointments** - Currently ongoing appointments
- **Pending Approvals** - Items requiring admin review

#### 2. **Recent Activity Feed**
Displays the latest platform events:
- New patient registrations
- Appointment scheduling
- Lab results uploads
- Payment transactions
- Doctor verifications

Each activity shows:
- Action type with color-coded icon
- User/entity involved
- Timestamp (relative time)

#### 3. **Quick Stats Dashboard**
Visual progress bars showing:
- Appointment Rate (87%)
- Patient Satisfaction (94%)
- Doctor Availability (78%)
- Revenue Growth (65%)

#### 4. **Recent Appointments Table**
Comprehensive table view with:
- Date & Time
- Patient information
- Doctor details
- Appointment type (Video/In-Person)
- Status (Scheduled/Completed/Pending)
- Action buttons (View/Edit/Delete)

#### 5. **Navigation Tabs**
- **Dashboard** - Overview and analytics
- **Patients** - Patient management
- **Doctors** - Healthcare provider management
- **Appointments** - Appointment scheduling & history
- **Clinics** - Facility management
- **Reports** - Analytics and insights
- **Settings** - Platform configuration

### Design Features

#### Animations
- Smooth fade-in and slide-in animations
- Staggered delays for sequential item appearance
- Hover effects with scale transforms
- Progress bar animations

#### Color Scheme
- Primary: Purple to Pink gradient
- Professional and premium feel
- Color-coded activity types
- Status badges with semantic colors

#### Responsive Design
- Mobile-friendly layout
- Adaptive grid systems
- Touch-optimized buttons
- Overflow handling for tables

### Data Integration

The admin portal connects to Supabase tables:
- `patients` - Patient records
- `doctors` - Healthcare provider data
- `appointments` - Scheduling information
- Platform analytics and metrics

### Security

- Admin-only access (requires authentication)
- Role-based permissions
- Secure data fetching
- Activity logging

### Future Enhancements

Planned features for the admin portal:
- Advanced analytics and reporting
- User management and permissions
- Bulk operations
- Export functionality
- Email notifications
- Audit logs
- Custom dashboards
- Real-time updates with subscriptions
