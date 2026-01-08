// Service consolidado para operações CRUD de personagens
import { Character, Chronicle } from '@/types'

export class ApiService {
  private baseUrl = '/api'

  // Characters CRUD
  async getCharacters(): Promise<Character[]> {
    const response = await fetch(`${this.baseUrl}/characters`)
    if (!response.ok) throw new Error('Erro ao buscar personagens')
    const data = await response.json()
    return data.characters
  }

  async getCharacter(id: string): Promise<Character> {
    const response = await fetch(`${this.baseUrl}/characters/${id}`)
    if (!response.ok) throw new Error('Personagem não encontrado')
    const data = await response.json()
    return data.character
  }

  async createCharacter(character: Partial<Character>): Promise<Character> {
    const response = await fetch(`${this.baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    })
    if (!response.ok) throw new Error('Erro ao criar personagem')
    const data = await response.json()
    return data.character
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character> {
    const response = await fetch(`${this.baseUrl}/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Erro ao atualizar personagem')
    const data = await response.json()
    return data.character
  }

  async deleteCharacter(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/characters/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao deletar personagem')
  }

  // Chronicles CRUD
  async getChronicles(): Promise<Chronicle[]> {
    const response = await fetch(`${this.baseUrl}/chronicles`)
    if (!response.ok) throw new Error('Erro ao buscar crônicas')
    const data = await response.json()
    return data.chronicles
  }

  async createChronicle(chronicle: Partial<Chronicle>): Promise<Chronicle> {
    const response = await fetch(`${this.baseUrl}/chronicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chronicle)
    })
    if (!response.ok) throw new Error('Erro ao criar crônica')
    const data = await response.json()
    return data.chronicle
  }
}

export const apiService = new ApiService()