"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { askAI, analyzeCode } from '@/lib/ai-service'

interface AIToolsProps {
  onInsertContent: (content: string) => void;
  selectedText?: string;
}

export function AITools({ onInsertContent, selectedText }: AIToolsProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'r', label: 'R' },
    { value: 'sql', label: 'SQL' }
  ]

  const handleAskAI = async () => {
    if (!question.trim()) return
    
    setIsLoading(true)
    try {
      const response = await askAI(question)
      setAnswer(response)
    } catch (error) {
      console.error('Error asking AI:', error)
      setAnswer('Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const response = await analyzeCode(code, language)
      setAnalysis(response)
    } catch (error) {
      console.error('Error analyzing code:', error)
      setAnalysis('Failed to analyze code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center pb-2 border-b mb-2">
        <h2 className="text-xl font-bold">AI Tools</h2>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          Model: LLaMA v2 7B
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ask AI</h3>
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
          />
          <Button onClick={handleAskAI} disabled={isLoading}>
            Ask
          </Button>
        </div>
        {answer && (
          <>
            <p className="mt-2 text-sm">{answer}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onInsertContent(`\nAI Response:\n${answer}\n`);
                setQuestion('');
                setAnswer('');
              }}
            >
              Insert Response
            </Button>
          </>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Code Execution & Analysis</h3>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code to execute and analyze..."
          className="font-mono min-h-[200px]"
        />
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <Button 
            onClick={handleAnalyzeCode} 
            disabled={isLoading || !code.trim()}
            className="flex-grow"
          >
            {isLoading ? 'Processing...' : 'Execute & Analyze'}
          </Button>
        </div>
        {analysis && (
          <>
            <div className="mt-2 space-y-4">
              {/* Execution Result */}
              <div className="p-4 bg-muted rounded-md">
                <h4 className="text-sm font-semibold mb-2">Execution Result:</h4>
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {analysis.split('\n\nANALYSIS:')[0]}
                </pre>
              </div>
              
              {/* Code Analysis */}
              <div className="p-4 bg-muted rounded-md">
                <h4 className="text-sm font-semibold mb-2">Code Analysis:</h4>
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {analysis.includes('\n\nANALYSIS:') 
                    ? analysis.split('\n\nANALYSIS:')[1]
                    : 'No analysis available'}
                </pre>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInsertContent(`\nCode Results:\n${analysis}\n`)}
            >
              Insert Results
            </Button>
          </>
        )}
      </div>
    </div>
  )
} 