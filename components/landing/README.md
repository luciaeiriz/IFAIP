# Landing Page Components

This directory contains reusable landing page components for the IFAIP platform.

## Components

### HeroSection
Full-width hero section with background, badge, title, subtitle, bullet points, and CTAs.

**Props:**
- `badge?: string` - Badge text (default: "AI Training Platform")
- `title: string` - Main heading
- `subtitle: string` - Subheading text
- `bulletPoints: Array<{icon: React.ReactNode, text: string}>` - Array of bullet points with icons
- `backgroundImage?: string` - Optional background image URL

**Example:**
```tsx
import { HeroSection } from '@/components/landing'
import { CheckIcon } from '@/components/landing/icons'

<HeroSection
  badge="AI Training Platform"
  title="Master AI for Your Business"
  subtitle="Transform your operations with cutting-edge AI training programs"
  bulletPoints={[
    { icon: <CheckIcon />, text: "Expert-led courses" },
    { icon: <CheckIcon />, text: "Industry-specific training" },
    { icon: <CheckIcon />, text: "Flexible learning" }
  ]}
/>
```

### CourseBrowser
Comprehensive course browsing component with featured programs, search, filters, and course grid.

**Props:**
- `tag: CourseTag` - Course tag to filter by ('Business', 'Restaurant', or 'Fleet')

**Features:**
- Featured Programs section (top 3 courses, reordered: 2nd, 1st with "Top Pick", 3rd)
- Search functionality
- Level filter chips (All Levels, Beginner, Intermediate, Advanced)
- Provider dropdown filter
- Sort options (Recommended, Newest, Shortest)
- Responsive 3-column course grid

**Example:**
```tsx
import { CourseBrowser } from '@/components/landing'

<CourseBrowser tag="Restaurant" />
```

### TrustStrip
Simple trust indicator strip with company logos/names.

**Props:**
- `label?: string` - Label text (default: "Trusted by")
- `companies: string[]` - Array of company names

**Example:**
```tsx
import { TrustStrip } from '@/components/landing'

<TrustStrip
  label="As featured by"
  companies={["TechCrunch", "Forbes", "Harvard Business Review"]}
/>
```

### ValueGrid
3-column grid displaying value propositions.

**Props:**
- `title?: string` - Section title (default: "What you'll be able to do")
- `values: Array<{icon: React.ReactNode, title: string, description: string}>` - Array of value cards

**Example:**
```tsx
import { ValueGrid } from '@/components/landing'
import { ChartIcon, LightBulbIcon, BookIcon } from '@/components/landing/icons'

<ValueGrid
  title="What you'll be able to do"
  values={[
    {
      icon: <ChartIcon />,
      title: "Analyze Data",
      description: "Use AI to analyze business metrics and make data-driven decisions"
    },
    {
      icon: <LightBulbIcon />,
      title: "Automate Processes",
      description: "Streamline operations with intelligent automation"
    },
    {
      icon: <BookIcon />,
      title: "Learn Continuously",
      description: "Stay updated with the latest AI trends and techniques"
    }
  ]}
/>
```

### LeadCapture
Lead capture form with UTM parameter tracking.

**Props:**
- `title: string` - Form title
- `subtitle: string` - Form subtitle
- `landingTag: string` - Landing page tag ('Business', 'Restaurant', or 'Fleet')
- `rolePlaceholder?: string` - Placeholder for role input (default: industry-specific)

**Features:**
- Captures UTM parameters from URL automatically
- Inserts to leads table with landing_tag
- Shows success state after submission
- Email validation

**Example:**
```tsx
import { LeadCapture } from '@/components/landing'

<LeadCapture
  title="Get Personalized Course Recommendations"
  subtitle="Tell us about yourself and we'll recommend the perfect courses for you"
  landingTag="Restaurant"
  rolePlaceholder="e.g., Restaurant Manager, Chef, Owner"
/>
```

### FAQ
Accordion-style FAQ component.

**Props:**
- `title?: string` - Section title (default: "Frequently Asked Questions")
- `items: Array<{question: string, answer: string}>` - Array of FAQ items

**Example:**
```tsx
import { FAQ } from '@/components/landing'

<FAQ
  title="Frequently Asked Questions"
  items={[
    {
      question: "How long are the courses?",
      answer: "Course durations vary from 2 weeks to 12 weeks depending on the program."
    },
    {
      question: "Do I need prior experience?",
      answer: "No prior experience is required. We offer courses for all skill levels."
    }
  ]}
/>
```

## Complete Landing Page Example

```tsx
'use client'

import {
  HeroSection,
  CourseBrowser,
  TrustStrip,
  ValueGrid,
  LeadCapture,
  FAQ,
} from '@/components/landing'
import { CheckIcon, ChartIcon, LightBulbIcon, BookIcon } from '@/components/landing/icons'

export default function RestaurantLandingPage() {
  return (
    <>
      <HeroSection
        badge="AI for Restaurants"
        title="Transform Your Restaurant with AI"
        subtitle="Learn how to implement AI solutions that streamline operations and boost customer satisfaction"
        bulletPoints={[
          { icon: <CheckIcon />, text: "Inventory management" },
          { icon: <CheckIcon />, text: "Customer insights" },
          { icon: <CheckIcon />, text: "Operational efficiency" }
        ]}
      />

      <TrustStrip
        companies={["McDonald's", "Starbucks", "Chipotle"]}
      />

      <ValueGrid
        values={[
          {
            icon: <ChartIcon />,
            title: "Optimize Inventory",
            description: "Reduce waste and improve ordering with AI-powered predictions"
          },
          {
            icon: <LightBulbIcon />,
            title: "Enhance Customer Experience",
            description: "Personalize service and recommendations using AI"
          },
          {
            icon: <BookIcon />,
            title: "Streamline Operations",
            description: "Automate routine tasks and focus on what matters"
          }
        ]}
      />

      <CourseBrowser tag="Restaurant" />

      <LeadCapture
        title="Get Restaurant-Specific Course Recommendations"
        subtitle="Tell us about your role and we'll recommend the perfect AI courses"
        landingTag="Restaurant"
        rolePlaceholder="e.g., Restaurant Manager, Chef, Owner"
      />

      <FAQ
        items={[
          {
            question: "Are these courses restaurant-specific?",
            answer: "Yes, all courses in this section are tailored specifically for restaurant operations and management."
          },
          {
            question: "How long does it take to complete a course?",
            answer: "Course durations vary, but most restaurant-focused courses take 4-8 weeks to complete."
          }
        ]}
      />
    </>
  )
}
```

## Icons

Common icons are available in `icons.tsx`:
- `CheckIcon` - Checkmark icon
- `StarIcon` - Star icon
- `ClockIcon` - Clock/time icon
- `UserIcon` - User/person icon
- `BookIcon` - Book icon
- `LightBulbIcon` - Light bulb/idea icon
- `ChartIcon` - Chart/analytics icon

You can import and use these icons in your components:
```tsx
import { CheckIcon } from '@/components/landing/icons'
```

