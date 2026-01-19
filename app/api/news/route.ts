import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Cache the response for 1 hour
export const revalidate = 3600

interface NewsArticle {
  id: string
  category: 'news' | 'technology' | 'science' | 'business'
  label: string
  title: string
  description?: string
  date?: string
  time?: string
  href: string
  imageColor: string
  imageUrl?: string | null
}

async function fetchFromNewsAPI(category: string, limit: number): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY
  
  if (!apiKey) {
    console.error('NEWS_API_KEY is not set in environment variables')
    return []
  }

  try {
    // Build AI-focused query with category-specific terms
    let queryTerms = 'artificial intelligence OR AI OR machine learning OR deep learning OR neural networks'
    
    // Add category-specific AI terms to narrow results
    if (category === 'technology') {
      queryTerms += ' OR AI technology OR tech AI OR artificial intelligence technology'
    } else if (category === 'science') {
      queryTerms += ' OR AI research OR artificial intelligence research OR ML research'
    } else if (category === 'business') {
      queryTerms += ' OR AI business OR business AI OR AI enterprise OR enterprise AI'
    }
    
    const aiQuery = encodeURIComponent(queryTerms)
    
    // Calculate date one month ago (NewsAPI requires YYYY-MM-DD format)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const fromDate = oneMonthAgo.toISOString().split('T')[0] // Format: YYYY-MM-DD
    
    // Use everything endpoint for all categories to ensure AI-related content
    // Sort by relevancy to prioritize most relevant articles, not just newest
    // Fetch more results than needed so we can filter for AI relevance
    const fetchLimit = Math.max(limit * 3, 20) // Fetch 3x to filter for relevance
    const apiUrl = `https://newsapi.org/v2/everything?q=${aiQuery}&language=en&sortBy=relevancy&from=${fromDate}&pageSize=${fetchLimit}&apiKey=${apiKey}`

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'IFAIP-News-Aggregator/1.0'
      },
      cache: 'no-store'
    })

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

    // AI-related keywords to filter articles
    const aiKeywords = [
      'artificial intelligence', 'AI', 'machine learning', 'ML', 'deep learning',
      'neural network', 'neural networks', 'artificial neural', 'computer vision',
      'natural language processing', 'NLP', 'robotics', 'automation', 'algorithm',
      'data science', 'predictive analytics', 'chatbot', 'chatbots', 'GPT',
      'transformer', 'LLM', 'large language model', 'generative AI', 'gen AI'
    ]
    
    // Filter articles to ensure they're AI-related
    const isAIRelated = (article: any): boolean => {
      const title = (article.title || '').toLowerCase()
      const description = (article.description || article.content || '').toLowerCase()
      const text = `${title} ${description}`
      
      return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()))
    }

    const articles: NewsArticle[] = data.articles
      .filter((article: any) => {
        if (!article.title || !article.url || article.url === '[Removed]') {
          return false
        }
        
        // Ensure article is AI-related
        if (!isAIRelated(article)) {
          return false
        }
        
        return true
      })
      .slice(0, limit)
      .map((article: any, index: number) => {
        const publishedDate = new Date(article.publishedAt)
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })

        // Determine category and label
        let articleCategory: NewsArticle['category']
        let label: string

        if (category === 'technology' || category === 'science' || category === 'business') {
          // Use the category as-is
          articleCategory = category as 'technology' | 'science' | 'business'
          label = category.charAt(0).toUpperCase() + category.slice(1)
        } else {
          // For news category, all articles are news
          articleCategory = 'news'
          label = 'News'
        }

        // Clean up description
        let description = article.description || article.content || ''
        description = description.replace(/<[^>]*>/g, '')
        if (description.length > 200) {
          description = description.substring(0, 200).trim() + '...'
        }

        // Extract image URL from NewsAPI (urlToImage field)
        const imageUrl = article.urlToImage && article.urlToImage !== '[Removed]' 
          ? article.urlToImage 
          : null

        return {
          id: `news-api-${index}-${Date.now()}`,
          category: articleCategory,
          label: label,
          title: article.title,
          description: description || undefined,
          date: formattedDate,
          href: article.url,
          imageColor: colors[index % colors.length],
          imageUrl: imageUrl
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
        image_url: article.imageUrl || null,
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

      // Fetch from NewsAPI for supported categories
      const supportedCategories = ['news', 'technology', 'science', 'business']
      if (category === 'all' || supportedCategories.includes(category)) {
        const apiCategory = category === 'all' ? 'news' : category
        const apiArticles = await fetchFromNewsAPI(apiCategory, limit)
        
        // Save to database for future use (async, don't wait)
        if (apiArticles.length > 0) {
          saveToDatabase(apiArticles).catch(err => 
            console.error('Failed to save articles to database:', err)
          )
        }

        return NextResponse.json(apiArticles)
      }

      // No other categories supported
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
      imageUrl: item.image_url || null,
    }))

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching news:', error)
    // Return empty array on error - the frontend will handle fallback
    return NextResponse.json([], { status: 500 })
  }
}

