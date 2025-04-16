"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { MoreHorizontal, Search, UserCog, DollarSign } from "lucide-react"
import { Label } from "@/components/ui/label"

// Mock data for users
const mockUsers = [
  {
    id: "user-1",
    email: "john@example.com",
    balance: 1250.5,
    role: "user",
    inventoryCount: 24,
    createdAt: "2023-01-15",
  },
  {
    id: "user-2",
    email: "jane@example.com",
    balance: 450.75,
    role: "user",
    inventoryCount: 12,
    createdAt: "2023-02-20",
  },
  {
    id: "user-3",
    email: "admin@example.com",
    balance: 5000.0,
    role: "admin",
    inventoryCount: 56,
    createdAt: "2022-11-05",
  },
  {
    id: "user-4",
    email: "mike@example.com",
    balance: 125.25,
    role: "user",
    inventoryCount: 8,
    createdAt: "2023-03-10",
  },
  {
    id: "user-5",
    email: "sarah@example.com",
    balance: 780.0,
    role: "user",
    inventoryCount: 32,
    createdAt: "2023-01-25",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [balanceAmount, setBalanceAmount] = useState("")

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleRoleToggle = (user: any) => {
    setCurrentUser(user)
    setIsRoleDialogOpen(true)
  }

  const handleBalanceAdjust = (user: any) => {
    setCurrentUser(user)
    setBalanceAmount("")
    setIsBalanceDialogOpen(true)
  }

  const confirmRoleToggle = () => {
    if (!currentUser) return

    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          role: user.role === "admin" ? "user" : "admin",
        }
      }
      return user
    })

    setUsers(updatedUsers)
    toast({
      title: "Role updated",
      description: `${currentUser.email} is now a ${currentUser.role === "admin" ? "user" : "admin"}.`,
    })
    setIsRoleDialogOpen(false)
    setCurrentUser(null)
  }

  const confirmBalanceAdjust = () => {
    if (!currentUser) return

    const amount = Number.parseFloat(balanceAmount)
    if (isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number.",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          balance: user.balance + amount,
        }
      }
      return user
    })

    setUsers(updatedUsers)
    toast({
      title: "Balance adjusted",
      description: `${currentUser.email}'s balance has been ${amount >= 0 ? "increased" : "decreased"} by $${Math.abs(amount).toFixed(2)}.`,
    })
    setIsBalanceDialogOpen(false)
    setCurrentUser(null)
    setBalanceAmount("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage users and their permissions.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Cards</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>${user.balance.toFixed(2)}</TableCell>
                <TableCell>{user.inventoryCount}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleRoleToggle(user)}>
                        <UserCog className="mr-2 h-4 w-4" />
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBalanceAdjust(user)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Adjust Balance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Role Toggle Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser?.role === "admin" ? "Remove Admin Role" : "Grant Admin Role"}</DialogTitle>
            <DialogDescription>
              {currentUser?.role === "admin"
                ? "This will remove admin privileges from this user."
                : "This will grant admin privileges to this user."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              User: <span className="font-medium">{currentUser?.email}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRoleToggle}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance Adjustment Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>Enter an amount to add or subtract from the user's balance.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>
              User: <span className="font-medium">{currentUser?.email}</span>
            </p>
            <p>
              Current Balance: <span className="font-medium">${currentUser?.balance.toFixed(2)}</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="balance-amount">Amount (use negative for subtraction)</Label>
              <Input
                id="balance-amount"
                type="number"
                step="0.01"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBalanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBalanceAdjust}>Adjust Balance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
