# Environment Variables Setup

## Required Environment Variables

### NEWS_API_KEY

This is required for fetching news from NewsAPI.org.

1. **Get your API key:**
   - Sign up at https://newsapi.org/register
   - Get your free API key from the dashboard

2. **Add to `.env.local`:**
   ```bash
   NEWS_API_KEY=your_api_key_here
   ```

3. **For Vercel deployment:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `NEWS_API_KEY` with your API key value
   - Make sure to add it for all environments (Production, Preview, Development)

4. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

## Verify Setup

After adding the variable and restarting:

1. Check the terminal - you should NOT see any "NEWS_API_KEY is not set" errors
2. Visit `/admin` → News tab
3. Click "Refresh News from API" - it should work without errors
4. Visit the homepage - news should automatically load

## Troubleshooting

- **"NEWS_API_KEY is not set" error:**
  - Make sure `.env.local` exists in the project root
  - Make sure the variable name is exactly `NEWS_API_KEY` (no spaces, correct capitalization)
  - Restart your dev server after adding/changing the variable
  - For Vercel: Make sure you've added it in the dashboard and redeployed

- **News not loading:**
  - Check browser console for errors
  - Check terminal/server logs for API errors
  - Verify your API key is valid and has remaining credits

