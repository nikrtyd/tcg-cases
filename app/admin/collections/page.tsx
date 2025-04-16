"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Collection } from "@/contexts/auth-context"
import { MoreHorizontal, Plus, Pencil, Trash } from "lucide-react"

// Mock data for collections
const mockCollections: Collection[] = [
  {
    id: "collection-1",
    name: "Elemental Masters",
    description: "Cards representing the masters of the four elements: fire, water, earth, and air.",
  },
  {
    id: "collection-2",
    name: "Ancient Beasts",
    description: "Mythical creatures from ancient legends and folklore.",
  },
  {
    id: "collection-3",
    name: "Mythical Creatures",
    description: "Legendary beings with supernatural powers and abilities.",
  },
]

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
  }

  const handleAddCollection = () => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      ...formData,
    }
    setCollections([...collections, newCollection])
    toast({
      title: "Collection added",
      description: `${newCollection.name} has been added successfully.`,
    })
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCollection = () => {
    if (!currentCollection) return

    const updatedCollections = collections.map((collection) =>
      collection.id === currentCollection.id ? { ...collection, ...formData } : collection,
    )
    setCollections(updatedCollections)
    toast({
      title: "Collection updated",
      description: `${formData.name} has been updated successfully.`,
    })
    setIsEditDialogOpen(false)
    setCurrentCollection(null)
    resetForm()
  }

  const handleDeleteCollection = () => {
    if (!currentCollection) return

    const updatedCollections = collections.filter((collection) => collection.id !== currentCollection.id)
    setCollections(updatedCollections)
    toast({
      title: "Collection deleted",
      description: `${currentCollection.name} has been deleted successfully.`,
    })
    setIsDeleteDialogOpen(false)
    setCurrentCollection(null)
  }

  const openEditDialog = (collection: Collection) => {
    setCurrentCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (collection: Collection) => {
    setCurrentCollection(collection)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage your card collections and categories.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Collection</DialogTitle>
              <DialogDescription>Create a new collection for organizing your cards.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Collection name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this collection"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCollection}>Add Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle>{collection.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openEditDialog(collection)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteDialog(collection)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{collection.description || "No description provided."}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Make changes to the collection details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCollection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
