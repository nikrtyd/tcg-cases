"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Card as CardType } from "@/contexts/auth-context"
import { MoreHorizontal, Plus, Pencil, Trash } from "lucide-react"

// Mock data for cards
const mockCards: CardType[] = [
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

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardType[]>(mockCards)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState<CardType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    rarity: "common",
    imageUrl: "",
    price: 0,
    collectionId: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      rarity: "common",
      imageUrl: "",
      price: 0,
      collectionId: "",
    })
  }

  const handleAddCard = () => {
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      ...formData,
    }
    setCards([...cards, newCard])
    toast({
      title: "Card added",
      description: `${newCard.name} has been added successfully.`,
    })
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCard = () => {
    if (!currentCard) return

    const updatedCards = cards.map((card) => (card.id === currentCard.id ? { ...card, ...formData } : card))
    setCards(updatedCards)
    toast({
      title: "Card updated",
      description: `${formData.name} has been updated successfully.`,
    })
    setIsEditDialogOpen(false)
    setCurrentCard(null)
    resetForm()
  }

  const handleDeleteCard = () => {
    if (!currentCard) return

    const updatedCards = cards.filter((card) => card.id !== currentCard.id)
    setCards(updatedCards)
    toast({
      title: "Card deleted",
      description: `${currentCard.name} has been deleted successfully.`,
    })
    setIsDeleteDialogOpen(false)
    setCurrentCard(null)
  }

  const openEditDialog = (card: CardType) => {
    setCurrentCard(card)
    setFormData({
      name: card.name,
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      price: card.price,
      collectionId: card.collectionId || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (card: CardType) => {
    setCurrentCard(card)
    setIsDeleteDialogOpen(true)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
          <p className="text-muted-foreground">Manage your trading cards collection.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Card</DialogTitle>
              <DialogDescription>Create a new card for your TCG platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Card name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={formData.rarity} onValueChange={(value) => handleSelectChange("rarity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price.toString()}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collection">Collection</Label>
                <Select
                  value={formData.collectionId}
                  onValueChange={(value) => handleSelectChange("collectionId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockCollections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard}>Add Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img src={card.imageUrl || "/placeholder.svg"} alt={card.name} className="object-cover w-full h-full" />
              <div
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(card.rarity)}`}
              >
                {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
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
                    <DropdownMenuItem onClick={() => openEditDialog(card)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(card)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>Make changes to the card details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rarity">Rarity</Label>
              <Select value={formData.rarity} onValueChange={(value) => handleSelectChange("rarity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price.toString()}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-collection">Collection</Label>
              <Select
                value={formData.collectionId}
                onValueChange={(value) => handleSelectChange("collectionId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {mockCollections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCard}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
