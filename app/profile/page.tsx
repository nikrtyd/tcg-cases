"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import type { Card as CardType } from "@/contexts/auth-context"
import { MoreHorizontal, Trash, DollarSign, Filter } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for user inventory
const mockInventory: CardType[] = [
  {
    id: "card-1",
    name: "Fire Dragon",
    rarity: "legendary",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 199.99,
    collectionId: "collection-1",
  },
  {
    id: "card-2",
    name: "Water Elemental",
    rarity: "gold",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 49.99,
    collectionId: "collection-1",
  },
  {
    id: "card-3",
    name: "Earth Golem",
    rarity: "silver",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 24.99,
    collectionId: "collection-2",
  },
  {
    id: "card-4",
    name: "Wind Sprite",
    rarity: "common",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 4.99,
    collectionId: "collection-2",
  },
  {
    id: "card-5",
    name: "Lightning Phoenix",
    rarity: "diamond",
    imageUrl: "/placeholder.svg?height=300&width=200",
    price: 99.99,
    collectionId: "collection-1",
  },
]

// Mock data for collections
const mockCollections = [
  { id: "collection-1", name: "Elemental Masters" },
  { id: "collection-2", name: "Ancient Beasts" },
  { id: "collection-3", name: "Mythical Creatures" },
]

export default function ProfilePage() {
  const { user, updateBalance } = useAuth()
  const [inventory, setInventory] = useState<CardType[]>(mockInventory)
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState<CardType | null>(null)
  const [sortBy, setSortBy] = useState("name")
  const [filterRarity, setFilterRarity] = useState("all")
  const [filterCollection, setFilterCollection] = useState("all")

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile and inventory.</p>
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    )
  }

  const handleSelectCard = (cardId: string, checked: boolean) => {
    if (checked) {
      setSelectedCards([...selectedCards, cardId])
    } else {
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCards(filteredInventory.map((card) => card.id))
    } else {
      setSelectedCards([])
    }
  }

  const handleDeleteCard = (card: CardType) => {
    setCurrentCard(card)
    setIsDeleteDialogOpen(true)
  }

  const handleSellCard = (card: CardType) => {
    setCurrentCard(card)
    setIsSellDialogOpen(true)
  }

  const confirmDeleteCard = () => {
    if (currentCard) {
      setInventory(inventory.filter((card) => card.id !== currentCard.id))
      toast({
        title: "Card deleted",
        description: `${currentCard.name} has been removed from your inventory.`,
      })
    }
    setIsDeleteDialogOpen(false)
    setCurrentCard(null)
  }

  const confirmSellCard = () => {
    if (currentCard) {
      setInventory(inventory.filter((card) => card.id !== currentCard.id))
      updateBalance(currentCard.price)
      toast({
        title: "Card sold",
        description: `You sold ${currentCard.name} for $${currentCard.price.toFixed(2)}.`,
      })
    }
    setIsSellDialogOpen(false)
    setCurrentCard(null)
  }

  const handleBulkDelete = () => {
    if (selectedCards.length === 0) return

    setInventory(inventory.filter((card) => !selectedCards.includes(card.id)))
    toast({
      title: "Cards deleted",
      description: `${selectedCards.length} cards have been removed from your inventory.`,
    })
    setSelectedCards([])
  }

  const handleBulkSell = () => {
    if (selectedCards.length === 0) return

    const selectedCardObjects = inventory.filter((card) => selectedCards.includes(card.id))
    const totalValue = selectedCardObjects.reduce((sum, card) => sum + card.price, 0)

    setInventory(inventory.filter((card) => !selectedCards.includes(card.id)))
    updateBalance(totalValue)

    toast({
      title: "Cards sold",
      description: `You sold ${selectedCards.length} cards for $${totalValue.toFixed(2)}.`,
    })
    setSelectedCards([])
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-200 text-gray-800"
      case "silver":
        return "bg-gray-300 text-gray-800"
      case "gold":
        return "bg-yellow-300 text-yellow-800"
      case "diamond":
        return "bg-blue-300 text-blue-800"
      case "legendary":
        return "bg-purple-300 text-purple-800"
      default:
        return "bg-gray-200 text-gray-800"
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

  // Apply filters and sorting
  let filteredInventory = [...inventory]

  // Filter by rarity
  if (filterRarity !== "all") {
    filteredInventory = filteredInventory.filter((card) => card.rarity === filterRarity)
  }

  // Filter by collection
  if (filterCollection !== "all") {
    filteredInventory = filteredInventory.filter((card) => card.collectionId === filterCollection)
  }

  // Sort
  filteredInventory.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "rarity":
        const rarityOrder = { common: 1, silver: 2, gold: 3, diamond: 4, legendary: 5 }
        return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder]
      default:
        return 0
    }
  })

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Cards</h1>
        <p className="text-muted-foreground">Manage your card collection and inventory.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRarity} onValueChange={setFilterRarity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="diamond">Diamond</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCollection} onValueChange={setFilterCollection}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {mockCollections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCards.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedCards.length})
            </Button>
            <Button onClick={handleBulkSell}>
              <DollarSign className="mr-2 h-4 w-4" />
              Sell Selected ({selectedCards.length})
            </Button>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={selectedCards.length === filteredInventory.length && filteredInventory.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium">
          Select All ({filteredInventory.length})
        </label>
      </div>

      {filteredInventory.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No Cards Found</h2>
          <p className="text-muted-foreground">
            {inventory.length === 0
              ? "Your inventory is empty. Open some cases to get cards!"
              : "No cards match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((card) => (
            <Card key={card.id} className={`overflow-hidden ${getRarityGlow(card.rarity)}`}>
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                  />
                </div>
                <div className="aspect-[2/3] relative">
                  <img
                    src={card.imageUrl || "/placeholder.svg"}
                    alt={card.name}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(card.rarity)}`}
                  >
                    {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockCollections.find((c) => c.id === card.collectionId)?.name || "No Collection"}
                    </p>
                    <p className="text-lg font-semibold mt-1">${card.price.toFixed(2)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSellCard(card)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Sell for ${card.price.toFixed(2)}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCard(card)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCard} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sell Dialog */}
      <AlertDialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sell Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sell {currentCard?.name} for ${currentCard?.price.toFixed(2)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSellCard}>Sell</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
