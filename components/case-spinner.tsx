"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "@/contexts/auth-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"

type CaseSpinnerProps = {
  caseId: string
  onComplete: (card: CardType) => void
}

// Mock data for cards with their drop chances
const mockCards: (CardType & { dropChance: number })[] = [
  {
    id: "card-1",
    name: "Fire Dragon",
    rarity: "legendary",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 199.99,
    collectionId: "collection-1",
    dropChance: 0.3, // 0.3%
  },
  {
    id: "card-2",
    name: "Water Elemental",
    rarity: "gold",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 49.99,
    collectionId: "collection-1",
    dropChance: 4, // 4%
  },
  {
    id: "card-3",
    name: "Earth Golem",
    rarity: "silver",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 24.99,
    collectionId: "collection-2",
    dropChance: 15, // 15%
  },
  {
    id: "card-4",
    name: "Wind Sprite",
    rarity: "common",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 4.99,
    collectionId: "collection-2",
    dropChance: 79, // 79%
  },
  {
    id: "card-5",
    name: "Lightning Phoenix",
    rarity: "diamond",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 99.99,
    collectionId: "collection-1",
    dropChance: 1.7, // 1.7%
  },
]

// Mock case data
const mockCases = [
  {
    id: "case-1",
    name: "Starter Pack",
    price: 9.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "case-2",
    name: "Premium Collection",
    price: 24.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "case-3",
    name: "Diamond Hunter",
    price: 49.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
]

export default function CaseSpinner({ caseId, onComplete }: CaseSpinnerProps) {
  const { user, updateBalance } = useAuth()
  const [spinning, setSpinning] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [spinnerCards, setSpinnerCards] = useState<CardType[]>([])
  const spinnerRef = useRef<HTMLDivElement>(null)
  const [spinnerPosition, setSpinnerPosition] = useState(0)
  const [caseData, setCaseData] = useState<any>(null)

  // Get case data
  useEffect(() => {
    const foundCase = mockCases.find((c) => c.id === caseId)
    if (foundCase) {
      setCaseData(foundCase)
    }
  }, [caseId])

  // Generate spinner cards based on drop chances
  const generateSpinnerCards = () => {
    // Create a large array of cards based on their drop chances
    // This simulates the actual probability
    const cards: CardType[] = []

    // Add 50 cards to the spinner for visual effect
    for (let i = 0; i < 50; i++) {
      // For most of the cards, use weighted random selection
      if (i !== 30) {
        // The card at position 30 will be the actual result
        const randomNum = Math.random() * 100
        let cumulativeChance = 0

        for (const card of mockCards) {
          cumulativeChance += card.dropChance
          if (randomNum <= cumulativeChance) {
            cards.push(card)
            break
          }
        }
      }
    }

    return cards
  }

  // Determine the winning card based on probabilities
  const determineWinningCard = () => {
    const randomNum = Math.random() * 100
    let cumulativeChance = 0

    for (const card of mockCards) {
      cumulativeChance += card.dropChance
      if (randomNum <= cumulativeChance) {
        return card
      }
    }

    // Fallback to common card if something goes wrong
    return mockCards.find((card) => card.rarity === "common") || mockCards[0]
  }

  const startSpin = () => {
    if (!user || !caseData) return

    // Check if user has enough balance
    if (user.balance < caseData.price) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to open this case.",
        variant: "destructive",
      })
      return
    }

    // Deduct the case price from user balance
    updateBalance(-caseData.price)

    // Determine the winning card
    const winningCard = determineWinningCard()

    // Generate spinner cards
    const cards = generateSpinnerCards()

    // Place the winning card at position 30
    cards[30] = winningCard

    setSpinnerCards(cards)
    setSelectedCard(winningCard)
    setSpinning(true)

    // Reset spinner position
    setSpinnerPosition(0)

    // Start the animation
    let startTime: number | null = null
    const duration = 5000 // 5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth deceleration
      const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5)

      // Calculate the position based on progress
      // We want to end at position 30 (the winning card)
      const targetPosition = -(30 * 150) // Each card is 150px wide
      const currentPosition = -easeOutQuint(progress) * (cards.length * 150 - 300) + targetPosition

      setSpinnerPosition(currentPosition)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete
        setTimeout(() => {
          setSpinning(false)
          onComplete(winningCard)

          // Trigger special effects for rare cards
          if (winningCard.rarity === "diamond" || winningCard.rarity === "legendary") {
            triggerSpecialEffects(winningCard.rarity)
          }
        }, 500)
      }
    }

    requestAnimationFrame(animate)
  }

  const triggerSpecialEffects = (rarity: string) => {
    if (rarity === "legendary") {
      // Trigger confetti for legendary cards
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
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
    <div className="flex flex-col items-center gap-6">
      {caseData && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">{caseData.name}</h2>
          <p className="text-muted-foreground">Price: ${caseData.price.toFixed(2)}</p>
        </div>
      )}

      <div className="relative w-full max-w-3xl overflow-hidden">
        {/* Indicator */}
        <div className="absolute top-0 left-1/2 h-full w-1 -ml-0.5 bg-primary z-10"></div>

        {/* Spinner */}
        <div className="relative h-[225px] overflow-hidden">
          <div
            ref={spinnerRef}
            className="absolute flex transition-transform duration-500"
            style={{ transform: `translateX(${spinnerPosition}px)` }}
          >
            {spinnerCards.map((card, index) => (
              <div key={index} className={`flex-shrink-0 w-[150px] p-2 ${getRarityGlow(card.rarity)}`}>
                <div className={`border-2 ${getRarityClass(card.rarity)} rounded-md overflow-hidden h-full`}>
                  <div className="aspect-[2/3] relative">
                    <img
                      src={card.imageUrl || "/placeholder.svg"}
                      alt={card.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium truncate">{card.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{card.rarity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={startSpin}
        disabled={spinning || !user || (user && caseData && user.balance < caseData.price)}
      >
        {spinning ? "Opening..." : "Open Case"}
      </Button>

      {user && caseData && user.balance < caseData.price && (
        <p className="text-destructive text-sm">Insufficient balance to open this case.</p>
      )}
    </div>
  )
}
