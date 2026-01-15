# Codebase Audit Report - IFAIP
**Date:** Generated during audit  
**Purpose:** Identify unused code for safe removal  
**Priority:** Ensure NO current features are broken

---

## Executive Summary

This audit identified **potentially unused** code items that may be safe to remove. However, **ALL items require explicit approval** before removal, as some may be:
- Referenced dynamically
- Used in production workflows
- Needed for future features
- Part of manual processes

---

## ✅ CONFIRMED ACTIVE - DO NOT REMOVE

### Pages (All Active)
- ✅ `/` - Homepage (app/page.tsx)
- ✅ `/admin` - Admin dashboard (app/admin/page.tsx)
- ✅ `/courses` - Course discovery (app/courses/page.tsx)
- ✅ `/courses/[slug]` - Dynamic landing pages (app/courses/[slug]/page.tsx)
- ✅ `/courses/business` - Business courses (app/courses/business/page.tsx) - **ACTIVE, referenced in Header**
- ✅ `/courses/fleet` - Fleet courses (app/courses/fleet/page.tsx) - **ACTIVE, referenced in Header**
- ✅ `/courses/restaurant` - Restaurant courses (app/courses/restaurant/page.tsx) - **ACTIVE, referenced in Header**
- ✅ `/signup/[courseId]` - Signup form (app/signup/[courseId]/page.tsx)
- ✅ `/thank-you` - Post-signup (app/thank-you/page.tsx)
- ✅ `/about`, `/contact`, `/membership`, `/membership/join`, `/partner`, `/privacy`, `/terms` - All active pages
- ✅ `/not-found` - 404 page (app/not-found.tsx)

### Components (All Active)
- ✅ All components in `components/admin/` - Used in admin dashboard
- ✅ All components in `components/courses/` except those listed below
- ✅ All components in `components/home/` - Used on homepage
- ✅ All components in `components/landing/` - Used in dynamic landing pages
- ✅ `components/Header.tsx` - Site navigation
- ✅ `components/Footer.tsx` - Site footer
- ✅ `components/Layout.tsx` - Root layout wrapper
- ✅ `components/Logo.tsx` - Logo component
- ✅ `components/ui/AdvertiserDisclosureModal.tsx` - Used in courses
- ✅ `components/ui/Toast.tsx` - Used in signup page

### API Routes (All Active)
- ✅ All routes in `app/api/admin/` - Admin functionality
- ✅ All routes in `app/api/courses/` - Course data
- ✅ All routes in `app/api/landing-pages/` - Landing page data
- ✅ All routes in `app/api/leads/`, `/api/signups/`, `/api/news/` - Data collection
- ✅ `app/api/logo/[domain]/route.ts` - Logo fetching

### Library Functions (All Active)
- ✅ `lib/supabase.ts` - Client Supabase instance
- ✅ `lib/supabase-admin.ts` - Admin Supabase instance
- ✅ `lib/courses.ts` - Used by admin and signup pages (getAllCourses, getCourseById)
- ✅ `lib/landing-pages.ts` - Landing page data layer
- ✅ `lib/leads.ts` - Leads data layer
- ✅ `lib/signups.ts` - Signups data layer
- ✅ `lib/rank-course.ts` - Course ranking functionality
- ✅ `lib/generate-landing-page-description.ts` - AI description generation
- ✅ `src/data/courses.ts` - Used by courses pages (getCoursesByTag, getFeaturedCourses with relevancy support)

### Scripts (All Active - in package.json)
- ✅ `scripts/import-courses.ts` - Course import (npm run import-courses)
- ✅ `scripts/test-connection.ts` - DB testing (npm run test-db)
- ✅ `scripts/analyze-courses-with-openai.ts` - Course analysis (npm run analyze-courses)
- ✅ `scripts/generate-headlines-and-bullets.ts` - Content generation (npm run generate-headlines)
- ✅ `scripts/remove-duplicates.ts` - Data cleanup (npm run remove-duplicates)
- ✅ `scripts/rank-relevancy.ts` - Relevancy ranking (npm run rank-relevancy)
- ✅ `scripts/rank-courses-by-relevancy.ts` - Relevancy ordering (npm run rank-relevancy-order)
- ✅ `scripts/test-logo-api.ts` - Logo API testing (npm run test-logo-api)
- ✅ `scripts/test-all-logos.ts` - Logo testing (npm run test-all-logos)

### SQL Files (All Active)
- ✅ All files in `supabase/migrations/` - Database migrations (run in order)
- ✅ `supabase/config.toml` - Supabase configuration

### Data Files
- ✅ `data/business-courses.csv` - Used by import-courses script

### Documentation
- ✅ `README.md` - Project documentation
- ✅ `ENV_SETUP.md` - Environment setup guide
- ✅ `VERIFY_NEWS_SETUP.md` - News feature verification

---

## ⚠️ POTENTIALLY UNUSED - REQUIRES REVIEW

### Pages (Potentially Unused)

#### 1. `/test-db` (app/test-db/page.tsx)
**Status:** ⚠️ TEST PAGE - Not linked in navigation  
**Evidence:**
- Only referenced in package.json script `test-db`
- No imports or links found in codebase
- Appears to be a development/testing utility

**Recommendation:** **SAFE TO REMOVE** if not needed for debugging. Consider keeping if used for manual database testing.

---

#### 2. `/test-rls` (app/test-rls/page.tsx)
**Status:** ⚠️ TEST PAGE - Not linked in navigation  
**Evidence:**
- No imports or links found in codebase
- Appears to be a development/testing utility for RLS policies

**Recommendation:** **SAFE TO REMOVE** if RLS policies are stable. Consider keeping if used for manual RLS testing.

---

#### 3. `/ai-for-business` (app/ai-for-business/page.tsx)
**Status:** ⚠️ LEGACY PAGE - Superseded by dynamic `/courses/[slug]`  
**Evidence:**
- Only mentioned in README.md (outdated documentation)
- Not linked in Header, Footer, or any navigation
- Only links to `/courses/business` (which is the active page)
- Dynamic landing pages now handle this via `/courses/business`

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by dynamic landing pages. Update README.md to remove reference.

---

#### 4. `/ai-for-fleet` (app/ai-for-fleet/page.tsx)
**Status:** ⚠️ LEGACY PAGE - Superseded by dynamic `/courses/[slug]`  
**Evidence:**
- Only mentioned in README.md (outdated documentation)
- Not linked in Header, Footer, or any navigation
- Only links to `/courses/fleet` (which is the active page)
- Dynamic landing pages now handle this via `/courses/fleet`

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by dynamic landing pages. Update README.md to remove reference.

---

#### 5. `/ai-for-restaurants` (app/ai-for-restaurants/page.tsx)
**Status:** ⚠️ LEGACY PAGE - Superseded by dynamic `/courses/[slug]`  
**Evidence:**
- Only mentioned in README.md (outdated documentation)
- Not linked in Header, Footer, or any navigation
- Only links to `/courses/restaurant` (which is the active page)
- Dynamic landing pages now handle this via `/courses/restaurant`

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by dynamic landing pages. Update README.md to remove reference.

---

### Components (Potentially Unused)

#### 6. `components/courses/CourseDiscoveryHeader.tsx`
**Status:** ⚠️ EXPORTED BUT NEVER IMPORTED  
**Evidence:**
- Exported in `components/courses/index.ts`
- No imports found: `grep -r "CourseDiscoveryHeader" app components` returns only definition and export
- Not used in any page or component

**Recommendation:** **SAFE TO REMOVE** - Appears to be unused component. Verify it's not planned for future use.

---

#### 7. `components/courses/OurGuides.tsx`
**Status:** ⚠️ NEVER IMPORTED  
**Evidence:**
- Not exported in index.ts
- No imports found anywhere
- Contains hardcoded placeholder links (`href: '#'`)

**Recommendation:** **SAFE TO REMOVE** - Appears to be unused placeholder component.

---

#### 8. `components/courses/FeaturedProgram.tsx`
**Status:** ⚠️ NEVER IMPORTED  
**Evidence:**
- Not exported in index.ts
- No imports found anywhere
- Similar functionality exists in `FeaturedTopPicks.tsx` (which IS used)

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by FeaturedTopPicks component.

---

#### 9. `components/courses/DisclosureSection.tsx`
**Status:** ⚠️ EXPORTED BUT NEVER IMPORTED  
**Evidence:**
- Exported in `components/courses/index.ts`
- No imports found anywhere
- Similar disclosure exists in `AdvertiserDisclosureModal.tsx` (which IS used)

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by AdvertiserDisclosureModal component.

---

#### 10. `components/courses/RankedEditorialList.tsx`
**Status:** ⚠️ EXPORTED BUT NEVER IMPORTED  
**Evidence:**
- Exported in `components/courses/index.ts`
- No imports found anywhere
- Similar functionality exists in `AllCoursesGrid.tsx` and `FeaturedTopPicks.tsx`

**Recommendation:** **SAFE TO REMOVE** - Functionality replaced by other components.

---

#### 11. `components/landing/icons.tsx`
**Status:** ⚠️ ONLY REFERENCED IN DOCUMENTATION  
**Evidence:**
- Only mentioned in `components/landing/README.md`
- No actual imports found in codebase
- Icons may be defined inline in components instead

**Recommendation:** **REVIEW CAREFULLY** - Check if icons are used inline. If not, **SAFE TO REMOVE**.

---

### Scripts (Potentially Unused)

#### 12. `scripts/get-project-ref.sh`
**Status:** ⚠️ UTILITY SCRIPT - Not referenced  
**Evidence:**
- Not in package.json scripts
- No references found in codebase
- Appears to be a one-time setup utility

**Recommendation:** **SAFE TO REMOVE** if Supabase project is already linked. Keep if used for manual setup.

---

#### 13. `scripts/run-landing-pages-migrations.ts`
**Status:** ⚠️ MIGRATION SCRIPT - May be one-time use  
**Evidence:**
- Not in package.json scripts
- Migrations are in `supabase/migrations/` directory
- May have been used once during setup

**Recommendation:** **REVIEW** - If migrations already run, **SAFE TO REMOVE**. Keep if used for manual migration runs.

---

### SQL Files (Potentially Redundant)

#### 14. `supabase/complete-setup.sql`
**Status:** ⚠️ STANDALONE SETUP SCRIPT  
**Evidence:**
- Similar to `setup-tables-and-rls.sql` and `create-missing-tables-and-rls.sql`
- Migrations in `supabase/migrations/` are the canonical source
- May be redundant if migrations are used

**Recommendation:** **REVIEW** - If migrations are the primary setup method, this may be redundant. **KEEP** if used for manual setup.

---

#### 15. `supabase/fix-schema-and-rls.sql`
**Status:** ⚠️ STANDALONE FIX SCRIPT  
**Evidence:**
- Similar functionality to other setup scripts
- Migrations handle schema changes
- May be one-time fix script

**Recommendation:** **REVIEW** - If schema issues are resolved, **SAFE TO REMOVE**. **KEEP** if used for troubleshooting.

---

#### 16. `supabase/setup-tables-and-rls.sql`
**Status:** ⚠️ STANDALONE SETUP SCRIPT  
**Evidence:**
- Similar to `complete-setup.sql` and `create-missing-tables-and-rls.sql`
- Migrations are canonical source
- May be redundant

**Recommendation:** **REVIEW** - If migrations are primary, this may be redundant. **KEEP** if used for manual setup.

---

#### 17. `supabase/create-missing-tables-and-rls.sql`
**Status:** ⚠️ STANDALONE SETUP SCRIPT  
**Evidence:**
- Similar to other setup scripts
- Migrations handle this
- May be redundant

**Recommendation:** **REVIEW** - If migrations are primary, this may be redundant. **KEEP** if used for manual setup.

---

#### 18. `supabase/add-relevancy-columns.sql`
**Status:** ⚠️ STANDALONE MIGRATION  
**Evidence:**
- Similar migration exists: `supabase/migrations/20240102000000_add_relevancy_columns.sql`
- May be redundant if migration was run

**Recommendation:** **REVIEW** - If migration `20240102000000_add_relevancy_columns.sql` was run, this is redundant. **SAFE TO REMOVE** if migration covers it.

---

#### 19. `supabase/remove-duplicates.sql`
**Status:** ⚠️ STANDALONE CLEANUP SCRIPT  
**Evidence:**
- Referenced in package.json (`npm run remove-duplicates`) but script uses `scripts/remove-duplicates.ts`
- SQL file may be manual alternative

**Recommendation:** **REVIEW** - If TypeScript script is used, SQL may be redundant. **KEEP** if used for manual SQL execution.

---

#### 20. `supabase/rls-policies.sql`
**Status:** ⚠️ STANDALONE RLS SCRIPT  
**Evidence:**
- RLS policies are in migrations
- May be redundant if migrations cover RLS

**Recommendation:** **REVIEW** - If migrations handle RLS, this may be redundant. **KEEP** if used for manual RLS setup.

---

#### 21. `supabase/create-news-items-table.sql`
**Status:** ⚠️ STANDALONE MIGRATION  
**Evidence:**
- Similar migration exists: `supabase/migrations/20240104000000_create_news_items.sql`
- Referenced in VERIFY_NEWS_SETUP.md

**Recommendation:** **REVIEW** - If migration `20240104000000_create_news_items.sql` was run, this is redundant. **SAFE TO REMOVE** if migration covers it.

---

#### 22. `supabase/run-landing-pages-migrations.sql`
**Status:** ⚠️ COMBINED MIGRATION SCRIPT  
**Evidence:**
- Combines migrations: `20240105000000_create_landing_pages.sql` and `20240105000001_migrate_existing_landing_pages.sql`
- May be convenience script for manual execution

**Recommendation:** **REVIEW** - If migrations are run individually, this may be redundant. **KEEP** if used for manual combined execution.

---

## 📋 REMOVAL PROPOSAL SUMMARY

### High Confidence - Safe to Remove (After Approval)

1. **Pages:**
   - `/test-db` - Test page, not linked
   - `/test-rls` - Test page, not linked
   - `/ai-for-business` - Legacy, replaced by dynamic pages
   - `/ai-for-fleet` - Legacy, replaced by dynamic pages
   - `/ai-for-restaurants` - Legacy, replaced by dynamic pages

2. **Components:**
   - `components/courses/CourseDiscoveryHeader.tsx` - Exported but never imported
   - `components/courses/OurGuides.tsx` - Never imported, placeholder content
   - `components/courses/FeaturedProgram.tsx` - Never imported, replaced by FeaturedTopPicks
   - `components/courses/DisclosureSection.tsx` - Exported but never imported, replaced by AdvertiserDisclosureModal
   - `components/courses/RankedEditorialList.tsx` - Exported but never imported, replaced by other components

3. **Scripts:**
   - `scripts/get-project-ref.sh` - Utility script, not referenced

### Medium Confidence - Review Before Removal

4. **Components:**
   - `components/landing/icons.tsx` - Only in docs, check if used inline

5. **Scripts:**
   - `scripts/run-landing-pages-migrations.ts` - May be used for manual migrations

6. **SQL Files:**
   - `supabase/complete-setup.sql` - May be used for manual setup
   - `supabase/fix-schema-and-rls.sql` - May be used for troubleshooting
   - `supabase/setup-tables-and-rls.sql` - May be used for manual setup
   - `supabase/create-missing-tables-and-rls.sql` - May be used for manual setup
   - `supabase/add-relevancy-columns.sql` - Check if migration covers it
   - `supabase/remove-duplicates.sql` - May be manual SQL alternative
   - `supabase/rls-policies.sql` - May be used for manual RLS setup
   - `supabase/create-news-items-table.sql` - Check if migration covers it
   - `supabase/run-landing-pages-migrations.sql` - May be convenience script

---

## 🔍 IMPORTANT NOTES

### Dual Course Libraries
**BOTH `lib/courses.ts` AND `src/data/courses.ts` ARE ACTIVE:**
- `lib/courses.ts`: Used by admin pages (`getAllCourses`) and signup/thank-you pages (`getCourseById`)
- `src/data/courses.ts`: Used by courses pages (`getCoursesByTag`, `getFeaturedCourses`) with relevancy support

**DO NOT REMOVE EITHER** - They serve different purposes and are both actively used.

### Dynamic Routing
- `/courses/[slug]` handles dynamic landing pages (e.g., `/courses/healthcare`, `/courses/education`)
- `/courses/business`, `/courses/fleet`, `/courses/restaurant` are still active and referenced in Header
- Legacy `/ai-for-*` pages are NOT needed as they just redirect to `/courses/*`

### Migrations vs Standalone SQL
- Migrations in `supabase/migrations/` are the canonical source
- Standalone SQL files may be:
  - Manual setup alternatives
  - One-time fix scripts
  - Convenience scripts
- **Review each** to determine if still needed

---

## ✅ VERIFICATION CHECKLIST

Before removing ANY item, verify:

- [ ] Item is not referenced in any import statement
- [ ] Item is not dynamically imported or referenced
- [ ] Item is not used in production workflows
- [ ] Item is not needed for manual processes
- [ ] Item is not referenced in external documentation or bookmarks
- [ ] Removal won't break any existing features
- [ ] Item is truly redundant (not serving a different purpose)

---

## 📝 NEXT STEPS

1. **Review this report** and approve items for removal
2. **Test each removal** individually to ensure nothing breaks
3. **Update documentation** (README.md) to remove references to deleted pages
4. **Commit removals** with clear messages explaining what was removed and why

---

**Generated:** During comprehensive codebase audit  
**Status:** Ready for review and approval
