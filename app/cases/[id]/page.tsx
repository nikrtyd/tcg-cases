"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import CaseSpinner from "@/components/case-spinner"
import type { Card as CardType } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CaseOpeningPage() {
  const { id } = useParams()
  const { user, updateBalance } = useAuth()
  const [openedCard, setOpenedCard] = useState<CardType | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSpinComplete = (card: CardType) => {
    setOpenedCard(card)
    setShowResult(true)

    // Add the card to user inventory (in a real app, this would be an API call)
    // For now, we'll just show a toast
    toast({
      title: `You got a ${card.rarity} card!`,
      description: `${card.name} has been added to your inventory.`,
    })
  }

  const handleSellCard = () => {
    if (!openedCard) return

    // Add the card price to user balance
    updateBalance(openedCard.price)

    toast({
      title: "Card sold",
      description: `You sold ${openedCard.name} for $${openedCard.price.toFixed(2)}.`,
    })

    // Reset the state
    setOpenedCard(null)
    setShowResult(false)
  }

  const handleKeepCard = () => {
    toast({
      title: "Card kept",
      description: `${openedCard?.name} has been added to your inventory.`,
    })

    // Reset the state
    setOpenedCard(null)
    setShowResult(false)
  }

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400"
      case "silver":
        return "border-gray-300"
      case "gold":
        return "border-yellow-400"
      case "diamond":
        return "border-blue-400 animate-pulse"
      case "legendary":
        return "border-purple-500 animate-pulse"
      default:
        return "border-gray-400"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "diamond":
        return "shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      case "legendary":
        return "shadow-[0_0_20px_rgba(168,85,247,0.6)]"
      default:
        return ""
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>

      {!user ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to open cases.</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      ) : (
        <div>
          {showResult ? (
            <div className="flex flex-col items-center gap-8 py-12">
              <h2 className="text-3xl font-bold text-center">
                You got a {openedCard?.rarity.charAt(0).toUpperCase() + openedCard?.rarity.slice(1)} Card!
              </h2>

              <div
                className={`border-4 ${getRarityClass(openedCard?.rarity || "common")} rounded-lg overflow-hidden max-w-xs ${getRarityGlow(openedCard?.rarity || "common")}`}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={openedCard?.imageUrl || "/placeholder.svg"}
                    alt={openedCard?.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 bg-card">
                  <h3 className="text-xl font-bold">{openedCard?.name}</h3>
                  <p className="text-muted-foreground capitalize">{openedCard?.rarity}</p>
                  <p className="text-lg font-semibold mt-2">${openedCard?.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handleSellCard}>
                  Sell for ${openedCard?.price.toFixed(2)}
                </Button>
                <Button onClick={handleKeepCard}>Keep Card</Button>
              </div>

              <Button variant="secondary" onClick={() => setShowResult(false)}>
                Open Another
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <CaseSpinner caseId={id as string} onComplete={handleSpinComplete} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
