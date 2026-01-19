# IFAIP - International Federation for Artificial Intelligence Professionals

A course discovery platform for AI training.

## Project Overview

IFAIP is a platform that helps users discover and sign up for AI training courses. The platform tracks courses, leads, and course signups.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript and Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS

## Database Schema

The project uses Supabase (PostgreSQL) with the following tables:

- **courses**: Stores course information including details, pricing, and metadata
- **leads**: Tracks user leads with UTM parameters
- **signups**: Records course signups with user information and tracking data

## Setup

### Database Setup

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` directory in order
3. Configure your environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Routes

The application includes the following routes:

- `/` - Homepage
- `/courses` - Course discovery page
- `/courses/:id` - Course detail page
- `/ai-for-business` - Landing page for business
- `/ai-for-restaurants` - Landing page for restaurants
- `/ai-for-fleet` - Landing page for fleet management
- `/signup/:courseId` - Signup form page
- `/thank-you` - Post-signup confirmation
- `/about` - About page
- `/membership` - Membership information
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `*` - 404 Not Found page

## Logo

Place your IFAIP logo image file in the `public/` directory as `logo.png`. The Logo component will automatically use it. Supported formats: PNG, SVG, JPG. If no logo file is found, a text-based fallback will be displayed.

## Data Layer

The data layer is located in `lib/courses.ts` and provides the following functions:

- **`getCoursesByTag(tag: CourseTag)`**: Fetches all courses with matching tag courses first (sorted by priority), followed by remaining courses
- **`getCourseById(id: string)`**: Fetches a single course by ID, returns `null` if not found
- **`getAllCourses()`**: Fetches all courses ordered by priority ascending
- **`getFeaturedCourses()`**: Fetches featured courses (`is_featured = true`) ordered by priority ascending

Course types are defined in `types/course.ts` and match the database schema.

## Deployment

This Next.js application can be deployed to various platforms. Here are instructions for common hosting providers:

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (required for admin operations)
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for admin functionality (signups, leads, contact submissions management). Without it, admin pages will not work in production.

### Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (required for admin operations)
5. Deploy!

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for admin functionality. Without it, admin pages will not work in production.

### Other Platforms

For other platforms (AWS, DigitalOcean, etc.):
1. Set the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (required for admin operations)
2. Run `npm run build` to build the application
3. Run `npm start` to start the production server

**Important**: 
- Never commit your `.env.local` file to version control. Always set environment variables in your hosting platform's dashboard.
- The `SUPABASE_SERVICE_ROLE_KEY` is **required** for admin functionality in production. You can find it in your Supabase Dashboard → Settings → API → Service Role Key (keep this secret!)

## Development

- Migrations are located in `supabase/migrations/` and should be run sequentially
- Frontend pages are located in `app/` directory using Next.js App Router
- Components are located in `components/` directory
- Data layer functions are located in `lib/` directory
- Type definitions are located in `types/` directory

