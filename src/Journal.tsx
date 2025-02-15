"use client"

import type React from "react"

import { Calendar, Search, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface JournalEntry {
  date: string
  entry: string
}

export default function JournalApp() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [relevantEntries, setRelevantEntries] = useState<JournalEntry[]>([])
  const [newThought, setNewThought] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5001/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process query")
      }

      setResult(data.result)
      if (data.relevantEntries) {
        setRelevantEntries(data.relevantEntries)
      }
    } catch (err) {
      console.error("Full error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewThought = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought: newThought }),
      })

      if (!response.ok) {
        throw new Error("Failed to add new thought")
      }

      setNewThought("")
      // You might want to update the relevantEntries here or fetch updated entries
    } catch (err) {
      console.error("Error adding new thought:", err)
      setError("Failed to add new thought. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Journal Analysis</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2">
            <Textarea
              placeholder="Add a new thought..."
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              className="min-h-[100px]"
            />
            <Button className="w-full mt-2" onClick={handleNewThought} disabled={!newThought.trim()}>
              Add Thought
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
        {/* Right side: Query and Results */}
        <section className="flex flex-col overflow-hidden">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ask Your Journal</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your journal entries..."
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {error && (
              <Card className="mt-4 bg-red-50">
                <CardContent className="pt-6 text-red-600">{error}</CardContent>
              </Card>
            )}

            {(isLoading || result) && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{result}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Left side: Relevant Entries with ScrollArea */}
        <section className="overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4">Relevant Entries</h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              {relevantEntries.map((entry, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Journal Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{entry.entry}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {entry.date}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </section>
      </div>
    </div>
  )
}

