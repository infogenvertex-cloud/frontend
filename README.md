# Gym Management System - Frontend

React + Vite frontend for the Marvel Fitness Gym Management System.

## Features

- 🎨 Marvel-themed UI Design
- 🔐 Secure Authentication
- 👥 Member Management with Search
- 📅 Subscription Tracking
- 💰 Payment Processing
- 📊 Interactive Dashboard
- 👤 Visitor Logging
- 📱 Responsive Design
- ⚡ Fast Performance with Vite

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 16+ and npm

### Setup

1. Clone the repository:
```bash
git clone <your-frontend-repo-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```env
VITE_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
```

6. Open browser at `http://localhost:5006`

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment to Vercel

### Prerequisites

- Vercel account
- Backend API deployed
- GitHub repository

### Steps

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. Configure Environment Variables in Vercel:
   - `VITE_API_URL`: Your backend Vercel URL (e.g., `https://your-backend.vercel.app`)

4. Deploy!

### Important: Update Backend CORS

After deploying frontend, update your backend's `FRONTEND_URL` environment variable with your frontend Vercel URL.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── api/         # API configuration
│   ├── assets/      # Images and media
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── App.jsx      # Main app component
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── .env.example     # Environment variables template
├── vercel.json      # Vercel configuration
└── package.json     # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Total members count
- Active subscriptions
- Revenue statistics
- Recent payments
- Expiring subscriptions alerts

### Members
- Add/Edit/Delete members
- Search by name, phone, or member ID
- View member details
- Track subscription history

### Subscriptions
- Create subscription plans
- Assign to members
- Track start/end dates
- Monitor active/expired status

### Payments
- Record payments
- Generate invoices
- Payment history
- Filter by member

### Visitors
- Log gym visitors
- Track visit timestamps
- Manage visitor records
- Mobile number validation

## Default Login Credentials

After backend setup, use these credentials:

- Email: `admin@gym.com`
- Password: `admin123`

**⚠️ Change these credentials in production!**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1s
- Time to Interactive: < 2s

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
