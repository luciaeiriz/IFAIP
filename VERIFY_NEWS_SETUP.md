# Verification Steps for News Feature

## Step 1: Verify Database Table Exists

Run this in Supabase SQL Editor to check if the table exists:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'news_items';
```

If it returns no rows, run the migration script: `supabase/create-news-items-table.sql`

## Step 2: Restart Dev Server

1. Stop your current dev server (Ctrl+C)
2. Start it again: `npm run dev`

## Step 3: Clear Browser Cache

1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
2. Or open DevTools → Application → Clear Storage → Clear site data

## Step 4: Verify Admin Tab

1. Go to `/admin` and log in
2. You should see tabs: Dashboard, Courses, Landing Pages, **News**, Leads, Signups
3. Click on the News tab
4. You should see the News Management interface

## Step 5: Verify Homepage

1. Go to `/` (homepage)
2. Scroll to the "Latest" section
3. Check browser console for any errors
4. If database is empty, you should see mock data

## Step 6: Add Test News Item

1. In `/admin` → News tab
2. Click "Add New Item"
3. Fill in:
   - Category: News
   - Label: News
   - Title: Test Article
   - URL: https://example.com
   - Image Color: from-blue-900 to-blue-700
4. Click "Create News Item"
5. Go back to homepage - you should see your test article

## Troubleshooting

### If News tab doesn't appear:
- Check browser console for errors
- Verify `components/admin/NewsManagement.tsx` exists
- Restart dev server

### If homepage shows no news:
- Check browser console for API errors
- Verify `/api/news` endpoint works: visit `http://localhost:3000/api/news` in browser
- Check if database table exists (Step 1)

### If API returns 500 error:
- Table doesn't exist - run the migration SQL script
- Wait 30 seconds after running migration for schema cache to refresh

