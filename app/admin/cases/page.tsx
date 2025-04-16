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
import { toast } from "@/components/ui/use-toast"
import type { Case, Card as CardType } from "@/contexts/auth-context"
import { MoreHorizontal, Plus, Pencil, Trash } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for cases
const mockCases: Case[] = [
  {
    id: "case-1",
    name: "Starter Pack",
    price: 9.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    cards: ["card-1", "card-2", "card-3", "card-4"],
  },
  {
    id: "case-2",
    name: "Premium Collection",
    price: 24.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    cards: ["card-1", "card-2", "card-5"],
  },
  {
    id: "case-3",
    name: "Diamond Hunter",
    price: 49.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    cards: ["card-1", "card-5"],
  },
]

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

export default function AdminCasesPage() {
  const [cases, setCases] = useState<Case[]>(mockCases)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCase, setCurrentCase] = useState<Case | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    cards: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleCardToggle = (cardId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        cards: [...formData.cards, cardId],
      })
    } else {
      setFormData({
        ...formData,
        cards: formData.cards.filter((id) => id !== cardId),
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      imageUrl: "",
      cards: [],
    })
  }

  const handleAddCase = () => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      ...formData,
    }
    setCases([...cases, newCase])
    toast({
      title: "Case added",
      description: `${newCase.name} has been added successfully.`,
    })
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCase = () => {
    if (!currentCase) return

    const updatedCases = cases.map((caseItem) =>
      caseItem.id === currentCase.id ? { ...caseItem, ...formData } : caseItem,
    )
    setCases(updatedCases)
    toast({
      title: "Case updated",
      description: `${formData.name} has been updated successfully.`,
    })
    setIsEditDialogOpen(false)
    setCurrentCase(null)
    resetForm()
  }

  const handleDeleteCase = () => {
    if (!currentCase) return

    const updatedCases = cases.filter((caseItem) => caseItem.id !== currentCase.id)
    setCases(updatedCases)
    toast({
      title: "Case deleted",
      description: `${currentCase.name} has been deleted successfully.`,
    })
    setIsDeleteDialogOpen(false)
    setCurrentCase(null)
  }

  const openEditDialog = (caseItem: Case) => {
    setCurrentCase(caseItem)
    setFormData({
      name: caseItem.name,
      price: caseItem.price,
      imageUrl: caseItem.imageUrl,
      cards: caseItem.cards,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (caseItem: Case) => {
    setCurrentCase(caseItem)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">Manage your card cases and their contents.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
              <DialogDescription>Create a new case with selected cards.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Case name"
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
                <Label>Cards in Case</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockCards.map((card) => (
                      <div key={card.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`card-${card.id}`}
                          checked={formData.cards.includes(card.id)}
                          onCheckedChange={(checked) => handleCardToggle(card.id, checked as boolean)}
                        />
                        <Label
                          htmlFor={`card-${card.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {card.name} ({card.rarity}) - ${card.price.toFixed(2)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCase}>Add Case</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{caseItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{caseItem.cards.length} cards included</p>
                  <p className="text-lg font-semibold mt-1">${caseItem.price.toFixed(2)}</p>
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
                    <DropdownMenuItem onClick={() => openEditDialog(caseItem)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(caseItem)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Case</DialogTitle>
            <DialogDescription>Make changes to the case details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label>Cards in Case</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockCards.map((card) => (
                    <div key={card.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-card-${card.id}`}
                        checked={formData.cards.includes(card.id)}
                        onCheckedChange={(checked) => handleCardToggle(card.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={`edit-card-${card.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {card.name} ({card.rarity}) - ${card.price.toFixed(2)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCase}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Case</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this case? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCase}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
