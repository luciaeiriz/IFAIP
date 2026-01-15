import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Cache the response for 1 hour
export const revalidate = 3600

interface NewsArticle {
  id: string
  category: 'news' | 'blog' | 'researcher-spotlights' | 'latest-research' | 'events'
  label: string
  title: string
  description?: string
  date?: string
  time?: string
  href: string
  imageColor: string
}

async function fetchFromNewsAPI(category: string, limit: number): Promise<NewsArticle[]> {
  // Try both NEWS_API_KEY and NEXT_PUBLIC_NEWS_API_KEY for flexibility
  const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY
  
  if (!apiKey) {
    console.error('NEWS_API_KEY is not set in environment variables')
    return []
  }

  try {
    // Fetch AI news from NewsAPI
    const query = encodeURIComponent('artificial intelligence OR AI OR machine learning OR deep learning OR neural networks')
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'IFAIP-News-Aggregator/1.0'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('NewsAPI error:', response.status, errorText)
      return []
    }

    const data = await response.json()

    if (!data.articles || data.articles.length === 0) {
      return []
    }

    // Transform NewsAPI articles to match LatestCard format
    const colors = [
      'from-blue-900 to-blue-700',
      'from-indigo-600 to-indigo-800',
      'from-purple-600 to-purple-800',
      'from-teal-600 to-teal-800',
      'from-green-600 to-green-800',
      'from-cyan-600 to-cyan-800',
      'from-amber-600 to-amber-800',
      'from-orange-600 to-orange-800',
    ]

    const articles: NewsArticle[] = data.articles
      .filter((article: any) => article.title && article.url && article.url !== '[Removed]')
      .slice(0, limit)
      .map((article: any, index: number) => {
        const publishedDate = new Date(article.publishedAt)
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })

        // Determine category based on source
        const blogSources = ['medium.com', 'substack.com', 'blog.', 'techcrunch.com']
        const isBlog = blogSources.some(source => 
          article.url?.toLowerCase().includes(source) || 
          article.source?.name?.toLowerCase().includes('blog')
        )
        
        const articleCategory: 'news' | 'blog' = isBlog ? 'blog' : 'news'

        // Clean up description
        let description = article.description || article.content || ''
        description = description.replace(/<[^>]*>/g, '')
        if (description.length > 200) {
          description = description.substring(0, 200).trim() + '...'
        }

        return {
          id: `news-api-${index}-${Date.now()}`,
          category: articleCategory,
          label: articleCategory === 'news' ? 'News' : 'Blog',
          title: article.title,
          description: description || undefined,
          date: formattedDate,
          href: article.url,
          imageColor: colors[index % colors.length]
        }
      })

    return articles
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error)
    return []
  }
}

async function saveToDatabase(articles: NewsArticle[]): Promise<void> {
  if (articles.length === 0) return

  try {
    // Group articles by category
    const articlesByCategory = articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    }, {} as Record<string, NewsArticle[]>)

    // Save each category's articles
    for (const [cat, catArticles] of Object.entries(articlesByCategory)) {
      // Delete existing items for this category
      await supabaseAdmin
        .from('news_items')
        .delete()
        .eq('category', cat)

      // Insert new items
      const newsItems = catArticles.map((article, index) => ({
        category: article.category,
        label: article.label,
        title: article.title,
        description: article.description || null,
        date: article.date || null,
        time: article.time || null,
        href: article.href,
        image_color: article.imageColor,
        display_order: index,
      }))

      await supabaseAdmin
        .from('news_items')
        .insert(newsItems)
    }
  } catch (error) {
    console.error('Error saving articles to database:', error)
    // Don't throw - we'll still return the articles even if save fails
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'all'
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    // First, try to fetch news items from database
    let query = supabase
      .from('news_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    // If database query failed or returned empty, fetch from NewsAPI
    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('Database query failed, fetching from NewsAPI:', error.message)
      } else {
        console.log('Database is empty, fetching from NewsAPI...')
      }

      // Only fetch news/blog categories from NewsAPI (other categories need manual entry)
      if (category === 'all' || category === 'news' || category === 'blog') {
        const apiArticles = await fetchFromNewsAPI(category === 'all' ? 'news' : category, limit)
        
        // Save to database for future use (async, don't wait)
        if (apiArticles.length > 0) {
          saveToDatabase(apiArticles).catch(err => 
            console.error('Failed to save articles to database:', err)
          )
        }

        return NextResponse.json(apiArticles)
      }

      // For other categories, return empty array
      return NextResponse.json([])
    }

    // Transform database records to match LatestCard format
    const articles: NewsArticle[] = data.map((item: any) => ({
      id: item.id,
      category: item.category,
      label: item.label,
      title: item.title,
      description: item.description || undefined,
      date: item.date || undefined,
      time: item.time || undefined,
      href: item.href,
      imageColor: item.image_color,
    }))

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching news:', error)
    // Return empty array on error - the frontend will handle fallback
    return NextResponse.json([], { status: 500 })
  }
}

