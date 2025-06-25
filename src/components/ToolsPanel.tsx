import { useState } from 'react'
import { Wrench, FileSearch, Terminal, Globe, Edit, Folder, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Tool {
  id: string
  name: string
  displayName: string
  description: string
  icon: React.ReactNode
  category: 'file' | 'system' | 'web' | 'development'
  isActive: boolean
}

export default function ToolsPanel() {
  const [tools] = useState<Tool[]>([
    {
      id: 'read-file',
      name: 'read-file',
      displayName: 'Read File',
      description: 'Read contents of a file',
      icon: <FileSearch className="h-4 w-4" />,
      category: 'file',
      isActive: true,
    },
    {
      id: 'write-file',
      name: 'write-file', 
      displayName: 'Write File',
      description: 'Create or modify files',
      icon: <Edit className="h-4 w-4" />,
      category: 'file',
      isActive: true,
    },
    {
      id: 'shell',
      name: 'shell',
      displayName: 'Shell',
      description: 'Execute shell commands',
      icon: <Terminal className="h-4 w-4" />,
      category: 'system',
      isActive: true,
    },
    {
      id: 'ls',
      name: 'ls',
      displayName: 'List Directory',
      description: 'List files and directories',
      icon: <Folder className="h-4 w-4" />,
      category: 'file',
      isActive: true,
    },
    {
      id: 'grep',
      name: 'grep',
      displayName: 'Search Text',
      description: 'Search for text patterns in files',
      icon: <Search className="h-4 w-4" />,
      category: 'file',
      isActive: true,
    },
    {
      id: 'web-fetch',
      name: 'web-fetch',
      displayName: 'Web Fetch',
      description: 'Fetch content from web URLs',
      icon: <Globe className="h-4 w-4" />,
      category: 'web',
      isActive: true,
    },
  ])

  const categories = {
    file: 'File System',
    system: 'System',
    web: 'Web',
    development: 'Development',
  }

  const getCategoryTools = (category: string) => {
    return tools.filter(tool => tool.category === category)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400'
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b">
        <Wrench className="h-5 w-5 mr-2" />
        <h2 className="font-semibold">Available Tools</h2>
        <div className="ml-auto flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {tools.filter(t => t.isActive).length} / {tools.length} active
          </div>
        </div>
      </div>

      {/* Tools List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(categories).map(([categoryKey, categoryName]) => {
            const categoryTools = getCategoryTools(categoryKey)
            if (categoryTools.length === 0) return null

            return (
              <div key={categoryKey}>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  {categoryName}
                </h3>
                <div className="space-y-2">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{tool.displayName}</h4>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(tool.isActive)}`} />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {tool.name}
                        </code>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}