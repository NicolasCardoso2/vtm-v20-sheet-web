'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AccordionListItemProps {
  item: any
  onSelect: (item: any) => void
  expanded: boolean
  onToggle: () => void
}

function AccordionListItem({ item, onSelect, expanded, onToggle }: AccordionListItemProps) {
  return (
    <div className="border border-gray-600 rounded-lg mb-2 bg-black/30">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
        onClick={onToggle}
      >
        <div className="flex-1">
          <h3 className="text-white font-medium">{item.nome}</h3>
          <p className="text-gray-300 text-sm">{item.resumo}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(item)
            }}
            className="bg-red-700 hover:bg-red-600 text-white"
          >
            Escolher
          </Button>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm mt-2">{item.descricao}</p>
          
          {item.disciplinas && item.disciplinas.length > 0 && (
            <div className="mt-3">
              <strong className="text-red-300 text-xs">Disciplinas:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.disciplinas.map((disc: string) => (
                  <span 
                    key={disc}
                    className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-xs"
                  >
                    {disc}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3">
              <strong className="text-gray-400 text-xs">Tags:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ModalSelectorProps {
  isOpen: boolean
  onClose: () => void
  title: string
  items: any[]
  onSelect: (item: any) => void
  searchPlaceholder?: string
  onSearch?: (term: string) => void
  loading?: boolean
}

export default function ModalSelector({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
  searchPlaceholder = "Buscar...",
  onSearch,
  loading = false
}: ModalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleSelect = (item: any) => {
    onSelect(item)
    onClose()
    setSearchTerm('')
    setExpandedItems(new Set())
  }

  const handleClose = () => {
    onClose()
    setSearchTerm('')
    setExpandedItems(new Set())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        
        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Lista de itens */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum item encontrado
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <AccordionListItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelect}
                  expanded={expandedItems.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}