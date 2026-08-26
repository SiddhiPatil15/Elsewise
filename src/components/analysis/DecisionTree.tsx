import { useState, useEffect } from 'react'
import type { DecisionTreeNode } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X, ChevronRight, ChevronDown } from 'lucide-react'

interface DecisionTreeProps {
  initialData?: DecisionTreeNode
  onChange: (data: DecisionTreeNode) => void
}

const defaultTree: DecisionTreeNode = {
  id: 'root',
  label: 'My Decision',
  children: []
}

function TreeNode({ node, onAddChild, onRemoveNode, depth = 0 }: { node: DecisionTreeNode, onAddChild: (id: string, label: string) => void, onRemoveNode: (id: string) => void, depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim()) return
    onAddChild(node.id, newLabel.trim())
    setNewLabel('')
    setAdding(false)
    setExpanded(true)
  }

  return (
    <div className="mt-2" style={{ marginLeft: depth > 0 ? '20px' : '0' }}>
      <div className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${depth === 0 ? 'border-petal-300 bg-petal-50' : 'border-pink-200 bg-white'}`}>
        {node.children.length > 0 ? (
          <button onClick={() => setExpanded(!expanded)} className="text-mauve-400 hover:text-mauve-600">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <span className={`flex-1 text-sm ${depth === 0 ? 'font-bold text-petal-700' : 'text-warm-800'}`}>{node.label}</span>
        
        <button onClick={() => setAdding(!adding)} className="text-mauve-400 hover:text-petal-500" title="Add consequence">
          <Plus size={16} />
        </button>
        {depth > 0 && (
          <button onClick={() => onRemoveNode(node.id)} className="text-mauve-400 hover:text-red-500" title="Remove">
            <X size={16} />
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="mt-2 ml-6 flex gap-2">
          <input 
            autoFocus
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="What happens next?"
            className="flex-1 rounded border border-pink-200 px-2 py-1 text-sm focus:border-petal-400 focus:outline-none"
          />
          <Button type="submit" className="py-1 px-2 text-xs">Add</Button>
        </form>
      )}

      {expanded && node.children.map(child => (
        <TreeNode key={child.id} node={child} onAddChild={onAddChild} onRemoveNode={onRemoveNode} depth={depth + 1} />
      ))}
    </div>
  )
}

export function DecisionTree({ initialData, onChange }: DecisionTreeProps) {
  const [tree, setTree] = useState<DecisionTreeNode>(initialData || defaultTree)

  useEffect(() => {
    onChange(tree)
  }, [tree, onChange])

  const addNode = (parentId: string, label: string) => {
    const clone = JSON.parse(JSON.stringify(tree)) as DecisionTreeNode
    
    const findAndAdd = (node: DecisionTreeNode): boolean => {
      if (node.id === parentId) {
        node.children.push({ id: crypto.randomUUID(), label, children: [] })
        return true
      }
      for (const child of node.children) {
        if (findAndAdd(child)) return true
      }
      return false
    }
    
    findAndAdd(clone)
    setTree(clone)
  }

  const removeNode = (nodeId: string) => {
    if (nodeId === tree.id) return // Can't remove root
    const clone = JSON.parse(JSON.stringify(tree)) as DecisionTreeNode
    
    const findAndRemove = (node: DecisionTreeNode): boolean => {
      const idx = node.children.findIndex(c => c.id === nodeId)
      if (idx !== -1) {
        node.children.splice(idx, 1)
        return true
      }
      for (const child of node.children) {
        if (findAndRemove(child)) return true
      }
      return false
    }
    
    findAndRemove(clone)
    setTree(clone)
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Consequence Tree</h3>
      <p className="mb-6 text-sm text-mauve-500">Map out options and their expected outcomes.</p>
      
      <div className="rounded-xl border border-dashed border-pink-200/60 p-4">
        <TreeNode node={tree} onAddChild={addNode} onRemoveNode={removeNode} />
      </div>
    </div>
  )
}
