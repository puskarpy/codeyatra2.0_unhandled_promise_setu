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
  Search, Edit, Trash2, Plus, FileText, 
  Filter, Download, Eye, CheckCircle2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialForms = [
  { 
    id: 1, 
    name: "Citizenship Certificate Application", 
    description: "Apply for a new citizenship certificate or renew an existing one.",
    category: "Identity",
    status: "Active",
    submissions: 1247,
    createdAt: "2025-01-15",
    updatedAt: "2026-02-10"
  },
  { 
    id: 2, 
    name: "Passport Application", 
    description: "Apply for a new passport or renew your existing passport.",
    category: "Travel",
    status: "Active",
    submissions: 892,
    createdAt: "2025-01-20",
    updatedAt: "2026-01-25"
  },
  { 
    id: 3, 
    name: "Driving License Application", 
    description: "Apply for a new driving license or renew your existing license.",
    category: "Transport",
    status: "Active",
    submissions: 634,
    createdAt: "2025-02-01",
    updatedAt: "2026-02-05"
  },
  { 
    id: 4, 
    name: "Land Registration Form", 
    description: "Register land ownership or transfer property.",
    category: "Property",
    status: "Draft",
    submissions: 0,
    createdAt: "2026-02-15",
    updatedAt: "2026-02-15"
  },
];

export default function ManageForms() {
  const [forms, setForms] = useState(initialForms);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingForm, setEditingForm] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: "",
    description: "",
    category: "",
    status: "Draft",
  });

  const categories = [...new Set(forms.map(f => f.category))];

  const filteredForms = forms.filter((form) => {
    const matchesSearch = 
      form.name.toLowerCase().includes(search.toLowerCase()) ||
      form.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || form.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setForms(forms.filter((form) => form.id !== id));
    }
  };

  const handleEdit = (form) => {
    setEditingForm({ ...form });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setForms(forms.map((f) => 
      f.id === editingForm.id 
        ? { ...editingForm, updatedAt: new Date().toISOString().split('T')[0] }
        : f
    ));
    setIsEditDialogOpen(false);
    setEditingForm(null);
  };

  const handleAddForm = () => {
    const newId = Math.max(...forms.map(f => f.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    setForms([...forms, { 
      ...newForm, 
      id: newId, 
      submissions: 0,
      createdAt: today,
      updatedAt: today
    }]);
    setNewForm({
      name: "",
      description: "",
      category: "",
      status: "Draft",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Forms</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage all government forms available to users.
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
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
                    Create Form
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Form</DialogTitle>
                    <DialogDescription>
                      Add a new government form to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Form Name</Label>
                      <Input
                        value={newForm.name}
                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                        placeholder="Enter form name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newForm.description}
                        onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                        placeholder="Describe what this form is for..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={newForm.category}
                          onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                          placeholder="Category"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={newForm.status} onValueChange={(v) => setNewForm({ ...newForm, status: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddForm}>Create Form</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <Card key={form.id} className="card-elevated flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{form.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{form.category}</Badge>
                    <Badge 
                      className={
                        form.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : form.status === "Draft"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {form.status}
                    </Badge>
                  </div>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {form.description}
              </p>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submissions</span>
                  <span className="font-medium">{form.submissions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{form.updatedAt}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(form)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(form.id)}
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

      {filteredForms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No forms found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Form</DialogTitle>
            <DialogDescription>
              Update form information and settings.
            </DialogDescription>
          </DialogHeader>
          {editingForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Form Name</Label>
                <Input
                  value={editingForm.name}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingForm.description}
                  onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editingForm.category}
                    onChange={(e) => setEditingForm({ ...editingForm, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingForm.status} 
                    onValueChange={(v) => setEditingForm({ ...editingForm, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
