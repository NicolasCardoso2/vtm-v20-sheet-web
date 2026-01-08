import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { data: character, error } = await supabase
      .from('characters')
      .select(`
        *,
        chronicle:chronicles(name, storyteller_user_id)
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ character })
  } catch (error) {
    return NextResponse.json(
      { error: 'Personagem não encontrado' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const updates = await request.json()

    const { data, error } = await supabase
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ character: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar personagem' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar personagem' },
      { status: 500 }
    )
  }
}