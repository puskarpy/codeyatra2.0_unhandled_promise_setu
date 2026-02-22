import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, Edit, Trash2, Plus, Link2, 
  Filter, Download, ExternalLink, Globe
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialPortals = [
  { 
    id: 1, 
    name: "Department of Passports", 
    url: "https://nepalpassport.gov.np", 
    category: "Immigration", 
    description: "Apply for and renew passports online.",
    status: "Active",
    visits: 12450
  },
  { 
    id: 2, 
    name: "Nagarik App", 
    url: "https://nagarikapp.gov.np", 
    category: "Digital Services", 
    description: "Access digital government services and identity.",
    status: "Active",
    visits: 8920
  },
  { 
    id: 3, 
    name: "Election Commission", 
    url: "https://election.gov.np", 
    category: "Governance", 
    description: "Voter registration and election information.",
    status: "Active",
    visits: 3450
  },
  { 
    id: 4, 
    name: "Department of Transport", 
    url: "https://dotm.gov.np", 
    category: "Transport", 
    description: "Driving license and vehicle registration.",
    status: "Active",
    visits: 5670
  },
  { 
    id: 5, 
    name: "Inland Revenue Department", 
    url: "https://ird.gov.np", 
    category: "Finance", 
    description: "Tax filing and PAN registration.",
    status: "Active",
    visits: 7890
  },
];

const categories = [...new Set(initialPortals.map(p => p.category))];

export default function ManagePortals() {
  const [portals, setPortals] = useState(initialPortals);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPortal, setEditingPortal] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPortal, setNewPortal] = useState({
    name: "",
    url: "",
    category: "",
    description: "",
    status: "Active",
  });

  const filteredPortals = portals.filter((portal) => {
    const matchesSearch = 
      portal.name.toLowerCase().includes(search.toLowerCase()) ||
      portal.description.toLowerCase().includes(search.toLowerCase()) ||
      portal.url.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || portal.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || portal.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this portal?")) {
      setPortals(portals.filter((portal) => portal.id !== id));
    }
  };

  const handleEdit = (portal) => {
    setEditingPortal({ ...portal });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setPortals(portals.map((p) => (p.id === editingPortal.id ? editingPortal : p)));
    setIsEditDialogOpen(false);
    setEditingPortal(null);
  };

  const handleAddPortal = () => {
    const newId = Math.max(...portals.map(p => p.id), 0) + 1;
    setPortals([...portals, { ...newPortal, id: newId, visits: 0 }]);
    setNewPortal({
      name: "",
      url: "",
      category: "",
      description: "",
      status: "Active",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Portals</h1>
        <p className="text-muted-foreground">
          Manage government portal links and information available to users.
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search portals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Portal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Portal</DialogTitle>
                    <DialogDescription>
                      Add a new government portal to the directory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Portal Name</Label>
                      <Input
                        value={newPortal.name}
                        onChange={(e) => setNewPortal({ ...newPortal, name: e.target.value })}
                        placeholder="Department of..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={newPortal.url}
                        onChange={(e) => setNewPortal({ ...newPortal, url: e.target.value })}
                        placeholder="https://example.gov.np"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={newPortal.category}
                        onChange={(e) => setNewPortal({ ...newPortal, category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newPortal.description}
                        onChange={(e) => setNewPortal({ ...newPortal, description: e.target.value })}
                        placeholder="Brief description of the portal..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={newPortal.status} onValueChange={(v) => setNewPortal({ ...newPortal, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPortal}>Add Portal</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => (
          <Card key={portal.id} className="card-elevated flex flex-col group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {portal.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{portal.category}</Badge>
                    <Badge 
                      className={
                        portal.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {portal.status}
                    </Badge>
                  </div>
                </div>
                <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {portal.description}
              </p>
              <div className="space-y-3 pt-4 border-t">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {portal.url}
                </a>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Visits</span>
                  <span className="font-medium">{portal.visits.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(portal)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(portal.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPortals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No portals found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Portal</DialogTitle>
            <DialogDescription>
              Update portal information and settings.
            </DialogDescription>
          </DialogHeader>
          {editingPortal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Portal Name</Label>
                <Input
                  value={editingPortal.name}
                  onChange={(e) => setEditingPortal({ ...editingPortal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={editingPortal.url}
                  onChange={(e) => setEditingPortal({ ...editingPortal, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingPortal.category}
                  onChange={(e) => setEditingPortal({ ...editingPortal, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingPortal.description}
                  onChange={(e) => setEditingPortal({ ...editingPortal, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editingPortal.status} 
                  onValueChange={(v) => setEditingPortal({ ...editingPortal, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

