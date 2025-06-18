# 🌐 Network Tracker

> A modern, mobile-first contact management app for networking professionals who value data ownership and seamless organization.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

## ✨ Overview

Network Tracker solves the chaos of managing professional connections from in-person events. Instead of scattered contacts across LinkedIn, phones, and notebooks, it provides a clean, organized system that syncs with Google Sheets for complete data ownership.

**Perfect for:** Entrepreneurs, sales professionals, consultants, job seekers, and anyone who networks frequently.

### 🎯 The Problem We Solve

- 📱 **Scattered Contacts**: Managing connections across multiple platforms
- 🧠 **Memory Overload**: Forgetting names and context after networking events
- 📊 **Data Lock-in**: Losing access to your networking data in proprietary systems
- 🔄 **No Follow-up System**: Missing opportunities due to poor relationship management

### 💡 Our Solution

A mobile-first web app that aggregates all networking contacts in organized lists, with full Google Sheets integration for data ownership and powerful relationship management features.

## 🚀 Features

### 📋 Core Features
- **📱 Mobile-First Design**: Optimized for on-the-go contact entry during events
- **📝 Smart Contact Forms**: Quick capture with progressive detail enhancement
- **🗂️ Organized Lists**: Event-based or context-based contact organization
- **🔍 Powerful Search**: Real-time search across all contacts and lists
- **🏷️ Tagging System**: Flexible categorization with custom tags

### 🔄 Data & Sync
- **☁️ Google Sheets Integration**: Direct two-way sync with your Google Drive
- **📊 Data Ownership**: You control your data, no vendor lock-in
- **⚡ Real-time Updates**: Instant synchronization across devices
- **🔒 Conflict Resolution**: Smart handling of simultaneous edits
- **📤 Export/Import**: CSV and Excel support for data portability

### 📱 Mobile Experience
- **✨ PWA Ready**: Install like a native app on any device
- **👆 Touch Gestures**: Swipe actions for quick contact management
- **🔄 Pull to Refresh**: Standard mobile refresh patterns
- **📴 Offline Support**: Core functionality works without internet
- **🎨 Clean UI**: Professional design using shadcn/ui components

### 🔐 Privacy & Security
- **🔑 Google OAuth**: Secure authentication without password management
- **🛡️ Row-Level Security**: Each user only accesses their own data
- **🔒 HTTPS Only**: All data transmission is encrypted
- **🏠 Data Sovereignty**: Your data stays in your Google account

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality, accessible components
- **[React Hook Form](https://react-hook-form.com/)** - Performant form management
- **[Zod](https://zod.dev/)** - Schema validation and type inference

### Backend & Database
- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time features
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Google APIs](https://developers.google.com/sheets/api)** - Sheets and Drive integration
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication with Google OAuth

### DevOps & Deployment
- **[Vercel](https://vercel.com/)** - Seamless deployment and hosting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **[ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)** - Code quality and formatting

## 🏗️ Project Structure

```
network-tracker/
├── .cursor/
│   └── rules/                    # Project documentation and guidelines
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (dashboard)/         # Main app pages
│   │   ├── api/                 # API endpoints
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── contacts/            # Contact-related components
│   │   ├── lists/               # List management components
│   │   └── forms/               # Form components
│   ├── lib/                     # Utility functions and configurations
│   │   ├── supabase.ts          # Supabase client setup
│   │   ├── google-apis.ts       # Google APIs integration
│   │   ├── validations.ts       # Zod schemas
│   │   └── utils.ts             # Helper functions
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
└── docs/                        # Additional documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm/yarn
- **Google Cloud Console** account for OAuth setup
- **Supabase** account for database

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/network-tracker.git
cd network-tracker
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Google APIs
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize and run migrations
supabase db reset
```

### 4. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API and Google Drive API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins

### 5. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📱 Screenshots

> 🚧 **Coming Soon**: Screenshots will be added as we progress through development phases.

### Mobile Views
- [ ] Landing page with Google sign-in
- [ ] Contact list with search and filters  
- [ ] Contact creation form
- [ ] List management interface
- [ ] Contact details with actions

### Desktop Views
- [ ] Responsive dashboard layout
- [ ] Advanced search and filtering
- [ ] Bulk operations interface

## 🗺️ Development Roadmap

### ✅ Phase 1: UI Foundation (Weeks 1-5)
- [x] Project setup and configuration
- [x] shadcn/ui integration and theming
- [x] Core layout components and navigation
- [x] Contact and list management UI
- [x] Forms and input components
- [x] Mobile interactions and gestures

### 🔄 Phase 2: Backend Development (Weeks 6-9)
- [ ] Supabase database schema implementation
- [ ] Google OAuth authentication setup
- [ ] API endpoints for CRUD operations
- [ ] Google Sheets integration service
- [ ] Data validation and security

### 📡 Phase 3: Integration (Weeks 10-12)
- [ ] Frontend-backend connection
- [ ] Real-time features with Supabase
- [ ] Google Sheets sync implementation
- [ ] Error handling and user feedback
- [ ] Performance optimization

### ✨ Phase 4: Polish & Launch (Weeks 13-14)
- [ ] Advanced features and bulk operations
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] PWA enhancements
- [ ] Testing and quality assurance
- [ ] Production deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](.cursor/rules/implementation_plan.mdc) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- **ESLint + Prettier**: Automated formatting and linting
- **TypeScript**: Strict type checking enabled
- **Conventional Commits**: Clear commit message format
- **Component Documentation**: JSDoc comments for complex components

## 📚 Documentation

Comprehensive project documentation is available in the `.cursor/rules/` directory:

- **[Product Requirements](/.cursor/rules/project_requirements_document.mdc)** - Complete feature specifications
- **[Technical Architecture](/.cursor/rules/tech_stack_document.mdc)** - Technology choices and rationale
- **[App Flow Design](/.cursor/rules/app_flow_document.mdc)** - User experience mapping
- **[Frontend Guidelines](/.cursor/rules/frontend_guidelines_document.mdc)** - UI/UX standards and components
- **[Backend Structure](/.cursor/rules/backend_structure_document.mdc)** - Database and API design
- **[Implementation Plan](/.cursor/rules/implementation_plan.mdc)** - Step-by-step development roadmap

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub with:

- **Bug Reports**: Steps to reproduce, expected behavior, screenshots
- **Feature Requests**: Use case description, proposed solution, mockups if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn](https://twitter.com/shadcn)** for the incredible UI component library
- **[Vercel](https://vercel.com/)** for seamless deployment and hosting
- **[Supabase](https://supabase.com/)** for the amazing developer experience
- **[Google](https://developers.google.com/)** for robust APIs and OAuth

## 📞 Contact & Support

- **GitHub Issues**: [Bug reports and feature requests](https://github.com/yourusername/network-tracker/issues)
- **Documentation**: [Project wiki and guides](https://github.com/yourusername/network-tracker/wiki)
- **Email**: your.email@example.com

---

<div align="center">

**Built with ❤️ for the networking community**

[⭐ Star this project](https://github.com/yourusername/network-tracker) if you find it useful!

</div>

<!-- Environment variables updated -->

<!-- API routes fixed for build-time env vars --> 