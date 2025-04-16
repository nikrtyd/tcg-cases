"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

// Mock data for cases
const mockCases = [
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
  {
    id: "case-4",
    name: "Legendary Box",
    price: 99.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    description: "The highest chance to find Legendary cards. For serious collectors only.",
  },
]

export default function CasesPage() {
  const { user } = useAuth()
  const [cases] = useState(mockCases)

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
        <p className="text-muted-foreground">Browse and open cases to discover rare cards for your collection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img
                src={caseItem.imageUrl || "/placeholder.svg"}
                alt={caseItem.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{caseItem.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{caseItem.description}</p>
              <p className="text-lg font-semibold mt-2">${caseItem.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/cases/${caseItem.id}`}>Open Case</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {!user && (
        <div className="mt-12 p-6 border rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Login to Open Cases</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to open cases and collect cards.</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
