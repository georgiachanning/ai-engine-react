import { Calendar, Lightbulb, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function JournalApp() {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Journal</h1>
        <Button>New Entry</Button>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        {/* Left side: Past Entry Exploration */}
        <section className="overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Journal Entry {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Right side: Question Box and Tags */}
        <section className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ask Your Journal</h2>
            <div className="flex gap-2">
              <Input placeholder="Ask a question about your journal entries..." />
              <Button size="icon">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          <div className="flex-grow overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">Explore Themes</h2>
            <ScrollArea className="h-[calc(100%-3rem)]">
              <div className="flex flex-col gap-2 pr-4">
                {[
                  "Difficulty managing work stress",
                  "Sense of community with friends",
                  "Goal to reframe relationship with mom more positively",
                  "Personal growth and self-reflection",
                  "Balancing career and personal life",
                  "Developing healthy habits",
                  "Exploring new hobbies and interests",
                  "Improving communication skills",
                  "Practicing mindfulness and gratitude",
                  "Setting and achieving personal goals",
                ].map((tag) => (
                  <a
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                    className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {tag}
                  </a>
                ))}
              </div>
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  )
}
