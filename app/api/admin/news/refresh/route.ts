import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// POST refresh news from NewsAPI
export async function POST(request: NextRequest) {
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

    const newsItems = data.articles
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

        // Determine if it's a blog based on source
        const blogSources = ['medium.com', 'substack.com', 'blog.', 'techcrunch.com']
        const isBlog = blogSources.some(source => 
          article.url?.toLowerCase().includes(source) || 
          article.source?.name?.toLowerCase().includes('blog')
        )
        
        const articleCategory = isBlog ? 'blog' : category

        // Clean up description
        let description = article.description || article.content || ''
        description = description.replace(/<[^>]*>/g, '')
        if (description.length > 200) {
          description = description.substring(0, 200).trim() + '...'
        }

        return {
          category: articleCategory,
          label: articleCategory === 'news' ? 'News' : 'Blog',
          title: article.title,
          description: description || null,
          date: formattedDate,
          href: article.url,
          image_color: colors[index % colors.length],
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

