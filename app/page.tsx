import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

// Mock data for featured cases
const featuredCases = [
  {
    id: "case-1",
    name: "Starter Pack",
    price: 9.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    description: "Perfect for beginners. Contains 5 cards with a chance for rare finds.",
  },
  {
    id: "case-2",
    name: "Premium Collection",
    price: 24.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    description: "Higher chance of Silver and Gold cards. Contains 10 cards.",
  },
  {
    id: "case-3",
    name: "Diamond Hunter",
    price: 49.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    description: "Increased chance for Diamond and Legendary cards. Contains 15 cards.",
  },
]

export default function Home() {
  return (
    <div className="container py-10">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <Sparkles className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Collect Rare Trading Cards</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground mb-8">
          Open cases, discover rare cards, and build your collection. Will you find the legendary holographic cards?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/cases">Browse Cases</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">Featured Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCases.map((caseItem) => (
            <Card key={caseItem.id} className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={caseItem.imageUrl || "/placeholder.svg"}
                  alt={caseItem.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{caseItem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{caseItem.description}</p>
                <p className="text-xl font-bold mt-2">${caseItem.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/cases/${caseItem.id}`}>Open Case</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Rare Cards</h3>
          <p className="text-muted-foreground">
            Discover cards with rarities from Common to Legendary with special holographic effects.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Build Collections</h3>
          <p className="text-muted-foreground">Complete card sets and collections to showcase your dedication.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Trade & Sell</h3>
          <p className="text-muted-foreground">Manage your inventory, sell duplicates, and increase your balance.</p>
        </div>
      </section>
    </div>
  )
}
