# Wolf Trading - Professional Trading Team Platform

A premium, modern, enterprise-grade trading team website with a clean, luxurious, and highly professional design.

## Features

### Landing Page
- Hero section with team introduction
- About section featuring three trading experts
- Team achievements and statistics
- Benefits section
- Professional footer with contact information
- Dark/Light mode support
- Smooth animations with Framer Motion
- Fully responsive design

### User Registration
- Comprehensive registration form with validation
- Email and phone number fields
- Strong password validation with strength indicator
- Terms acceptance checkbox
- Google OAuth integration (ready)
- Email authentication option
- Automatic welcome PDF download on registration

### Approval Workflow
- User accounts start in "Pending Approval" status
- Admin receives notifications for new registrations
- Admin can approve, reject, or suspend users
- Email notifications for approval status changes
- Audit logging for all actions

### Member Dashboard
- Overview with portfolio statistics
- Project tracking with progress indicators
- Educational resources library
- Market analysis reports
- Notification center
- Profile management

### Admin Panel
- User management table
- Search and filter users
- Approve/reject/suspend users
- Analytics dashboard with statistics
- Device and IP tracking
- Audit logs
- Real-time notifications

### Security Features
- Password hashing with bcrypt
- CSRF protection
- XSS protection
- SQL injection protection
- Encrypted database storage
- Secure session management
- GDPR/privacy compliance
- Audit logging

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Next.js API Routes** - Backend
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing

### Authentication
- **NextAuth.js** - Authentication (ready to configure)
- **Google OAuth** - Social login (ready to configure)

### Other
- **jsPDF** - PDF generation
- **Recharts** - Charts (for analytics)
- **Nodemailer** - Email notifications (ready to configure)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wolf-trading
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wolf_trading"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
ADMIN_EMAIL="admin@wolftrading.com"
```

4. Set up the database:
```bash
psql -U username -d wolf_trading -f src/lib/schema.sql
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
wolf-trading/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   └── users/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── approve/
│   │   │   │               └── route.ts
│   │   │   └── auth/
│   │   │       ├── register/
│   │   │       │   └── route.ts
│   │   │       └── welcome-pdf/
│   │   │           └── route.ts
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── lib/
│       ├── db.ts
│       └── schema.sql
├── public/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Deployment

### Railway (Recommended)

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment:
1. Push code to GitHub
2. Create new project on Railway from GitHub repo
3. Add PostgreSQL service
4. Configure environment variables
5. Deploy

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### AWS

1. Build the project:
```bash
npm run build
```

2. Deploy to AWS Amplify, EC2, or Elastic Beanstalk

## Database Schema

### Users Table
- User information (name, email, phone)
- Approval status (pending, approved, rejected, suspended)
- Password hash
- Two-factor authentication settings
- Device and browser info
- IP address tracking

### Sessions Table
- Session management for authentication

### Accounts Table
- OAuth account linking

### Audit Logs Table
- All user actions logged
- IP and user agent tracking

### Projects Table
- Trading projects and strategies

### Educational Materials Table
- Learning resources

### Market Reports Table
- Market analysis reports

### Notifications Table
- User notifications

## Security Considerations

- All passwords are hashed using bcrypt
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping
- CSRF protection via Next.js
- Secure session management
- GDPR compliance features
- Audit logging for all sensitive actions

## Future Enhancements

- [ ] Complete NextAuth.js configuration
- [ ] Implement email verification
- [ ] Add phone verification (OTP)
- [ ] Implement two-factor authentication
- [ ] Add CAPTCHA protection
- [ ] Set up email notifications
- [ ] Add real-time chat for members
- [ ] Implement advanced analytics
- [ ] Add mobile app (React Native)
- [ ] Integrate payment processing

## License

Proprietary - All rights reserved

## Support

For support, email support@wolftrading.com
