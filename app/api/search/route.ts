import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim().toLowerCase() || ''

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters', results: [] },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await (supabase as any)
      .from('products')
      .select('*')

    if (error) throw error

    // Client-side filtering for search
    const results = data.filter((product: any) => {
      const searchableFields = [
        product.name,
        product.description,
        product.category,
        product.collection,
        product.fabric,
      ]
        .filter(Boolean)
        .map((field: string) => field.toLowerCase())

      return searchableFields.some((field: string) =>
        field.includes(query)
      )
    })

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
