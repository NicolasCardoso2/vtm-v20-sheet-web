import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        *,
        chronicle:chronicles(name)
      `)

    if (error) throw error

    return NextResponse.json({ characters })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar personagens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const characterData = await request.json()

    const { data, error } = await supabase
      .from('characters')
      .insert(characterData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ character: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar personagem' },
      { status: 500 }
    )
  }
}