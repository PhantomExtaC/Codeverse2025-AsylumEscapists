"use client"

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { AITools } from './ai-tools'
import { Button } from '@/components/ui/button'
import { summarizeText } from '@/lib/ai-service'

export function DocumentEditor() {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    }
  })

  const handleInsertContent = (content: string) => {
    if (editor) {
      editor.commands.insertContent(content)
    }
  }

  const handleSummarize = async () => {
    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    )
    
    if (!selectedText) return
    
    setIsLoading(true)
    try {
      const summaryResult = await summarizeText(selectedText)
      setSummary(summaryResult)
    } catch (error) {
      console.error('Error summarizing text:', error)
      setSummary('Failed to summarize text')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
        <div className="w-full">
          <EditorContent editor={editor} className="min-h-[500px] border rounded-lg p-4" />
          
          {/* Text Selection Tools */}
          {editor && editor.state.selection.content().size > 0 && (
            <div className="mt-2">
              <Button 
                onClick={handleSummarize} 
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                {isLoading ? 'Summarizing...' : 'Summarize Selection'}
              </Button>
            </div>
          )}
        </div>
        <div>
          <AITools 
            onInsertContent={handleInsertContent}
            selectedText={editor?.state.doc.textBetween(
              editor.state.selection.from,
              editor.state.selection.to,
              ' '
            )}
          />
        </div>
      </div>
      
      {/* Summary Section - Outside and Below Editor */}
      {summary && (
        <div className="w-full p-4 border rounded-lg bg-muted/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Text Summary</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInsertContent(summary)}
              >
                Insert at Cursor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSummary('')}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="p-4 bg-card rounded-md">
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

