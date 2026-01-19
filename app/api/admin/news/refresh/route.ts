import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// POST refresh news from NewsAPI
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const category = body.category || 'news' // Default to 'news'
    const limit = body.limit || 4 // Default to 4 items per category

    // Get API key from environment variables
    // Try both NEWS_API_KEY and NEXT_PUBLIC_NEWS_API_KEY for flexibility
    const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY
    
    if (!apiKey) {
      console.error('NEWS_API_KEY is not set. Available env vars:', Object.keys(process.env).filter(k => k.includes('NEWS')))
      return NextResponse.json(
        { 
          error: 'NEWS_API_KEY is not set in environment variables. Please add it to your .env.local file and restart the dev server.',
          hint: 'Add NEWS_API_KEY=your_api_key_here to .env.local'
        },
        { status: 500 }
      )
    }

    // Check if category is supported by NewsAPI
    const supportedCategories = ['news', 'technology', 'science', 'business']
    if (!supportedCategories.includes(category)) {
      return NextResponse.json(
        { 
          error: `Category "${category}" is not supported for automatic fetching. Please add items manually via the admin interface.`,
          supportedCategories
        },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        { error: `Failed to fetch news from NewsAPI: ${response.status}` },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (!data.articles || data.articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles found' },
        { status: 404 }
      )
    }

    // Transform NewsAPI articles to match news_items format
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

    const newsItems = data.articles
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
        let articleCategory: string
        let label: string

        if (category === 'technology' || category === 'science' || category === 'business') {
          articleCategory = category
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
          category: articleCategory,
          label: label,
          title: article.title,
          description: description || null,
          date: formattedDate,
          href: article.url,
          image_color: colors[index % colors.length],
          image_url: imageUrl,
          display_order: index,
        }
      })

    // Delete existing news items for this category
    const { error: deleteError } = await supabaseAdmin
      .from('news_items')
      .delete()
      .eq('category', category)

    if (deleteError) {
      console.error('Error deleting existing news items:', deleteError)
      // Continue anyway - we'll try to insert
    }

    // Insert new news items
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('news_items')
      .insert(newsItems)
      .select()

    if (insertError) {
      console.error('Error inserting news items:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to save news items' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Refreshed ${insertedData.length} news items for category: ${category}`,
      newsItems: insertedData
    })
  } catch (error) {
    console.error('Error in POST /api/admin/news/refresh:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

