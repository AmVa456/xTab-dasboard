# Overview

xTab is a complete, production-ready social media post management dashboard built with modern web technologies. The application enables users to manage posts across multiple platforms (Reddit, Twitter, LinkedIn, Medium) through a unified interface. Features include real-time analytics, advanced filtering, post scheduling, and a responsive design with dark/light theme support.

## Recent Changes
- Fixed all TypeScript compilation errors
- Created comprehensive GitHub repository setup
- Added professional README.md with full documentation
- Implemented proper error handling and type safety
- Ready for deployment and GitHub hosting

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite for bundling and development
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM mode
- **Data Layer**: In-memory storage implementation with interface-based design for easy database migration
- **API Design**: RESTful endpoints for platforms and posts with proper error handling
- **Development Setup**: Hot module replacement via Vite integration in development mode

## Database Schema
The application uses Drizzle ORM with PostgreSQL dialect, defining two main entities:
- **Platforms**: Social media platforms with connection status and visual branding
- **Posts**: Content items with platform association, scheduling, and engagement metrics

The schema supports post statuses (draft, published, scheduled, failed) and tracks engagement data like likes and comments.

## Component Architecture
- **Design System**: Comprehensive UI component library built on Radix primitives
- **Layout Pattern**: Dashboard layout with sidebar navigation and main content area
- **Form Components**: Reusable form components with validation and error handling
- **Data Display**: Table components with filtering, sorting, and pagination capabilities

## Development Workflow
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Hot Reloading**: Vite-powered development with instant updates
- **Path Mapping**: Organized imports with @ aliases for clean code structure
- **Build Process**: Separate client and server builds with proper static asset handling

# External Dependencies

## Database & ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider (via @neondatabase/serverless)

## UI & Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Modern icon library for consistent iconography

## State Management & Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation for form data and API responses

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx & tailwind-merge**: Conditional CSS class handling
- **nanoid**: Unique ID generation for client-side operations