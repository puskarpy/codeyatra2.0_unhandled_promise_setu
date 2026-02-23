import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Search, Edit, Trash2, Plus, CheckSquare, 
  Filter, Download, Users, Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialSchemes = [
  { 
    id: "youth-employment", 
    name: "Youth Employment Program", 
    minAge: 18, 
    maxAge: 35, 
    districts: ["all"],
    description: "Employment opportunities and training for youth.",
    status: "Active",
    applicants: 1247
  },
  { 
    id: "senior-allowance", 
    name: "Senior Citizen Allowance", 
    minAge: 65, 
    maxAge: 120, 
    districts: ["all"],
    description: "Monthly allowance for senior citizens.",
    status: "Active",
    applicants: 8920
  },
  { 
    id: "scholarship", 
    name: "Government Scholarship", 
    minAge: 16, 
    maxAge: 30, 
    districts: ["all"],
    description: "Educational scholarships for students.",
    status: "Active",
    applicants: 3450
  },
  { 
    id: "housing-grant", 
    name: "Affordable Housing Grant", 
    minAge: 21, 
    maxAge: 60, 
    districts: ["Kathmandu", "Lalitpur", "Bhaktapur"],
    description: "Financial assistance for affordable housing.",
    status: "Active",
    applicants: 567
  },
  { 
    id: "agriculture-subsidy", 
    name: "Agriculture Subsidy Program", 
    minAge: 18, 
    maxAge: 70, 
    districts: ["all"],
    description: "Subsidies for farmers and agricultural activities.",
    status: "Draft",
    applicants: 0
  },
];

export default function ManageSchemes() {
  const [schemes, setSchemes] = useState(initialSchemes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingScheme, setEditingScheme] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({
    id: "",
    name: "",
    description: "",
    minAge: "",
    maxAge: "",
    districts: [],
    status: "Draft",
  });
  const [districtInput, setDistrictInput] = useState("");

  const districts = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Birgunj", "Dharan", "Butwal", "Hetauda", "Janakpur"];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || scheme.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      setSchemes(schemes.filter((scheme) => scheme.id !== id));
    }
  };

  const handleEdit = (scheme) => {
    setEditingScheme({ ...scheme });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setSchemes(schemes.map((s) => (s.id === editingScheme.id ? editingScheme : s)));
    setIsEditDialogOpen(false);
    setEditingScheme(null);
  };

  const handleAddScheme = () => {
    setSchemes([...schemes, { ...newScheme, applicants: 0 }]);
    setNewScheme({
      id: "",
      name: "",
      description: "",
      minAge: "",
      maxAge: "",
      districts: [],
      status: "Draft",
    });
    setIsAddDialogOpen(false);
  };

  const addDistrict = (scheme, district) => {
    if (district === "all") {
      return { ...scheme, districts: ["all"] };
    }
    if (!scheme.districts.includes(district) && !scheme.districts.includes("all")) {
      return { ...scheme, districts: [...scheme.districts, district] };
    }
    return scheme;
  };

  const removeDistrict = (scheme, district) => {
    return { ...scheme, districts: scheme.districts.filter(d => d !== district) };
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Schemes</h1>
        <p className="text-muted-foreground">
          Manage eligibility schemes and programs available to users.
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
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
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Scheme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Scheme</DialogTitle>
                    <DialogDescription>
                      Create a new eligibility scheme for users.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Scheme ID</Label>
                        <Input
                          value={newScheme.id}
                          onChange={(e) => setNewScheme({ ...newScheme, id: e.target.value })}
                          placeholder="scheme-id"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={newScheme.status} onValueChange={(v) => setNewScheme({ ...newScheme, status: v })}>
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
                    <div className="space-y-2">
                      <Label>Scheme Name</Label>
                      <Input
                        value={newScheme.name}
                        onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                        placeholder="Scheme Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={newScheme.description}
                        onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                        placeholder="Brief description..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Minimum Age</Label>
                        <Input
                          type="number"
                          value={newScheme.minAge}
                          onChange={(e) => setNewScheme({ ...newScheme, minAge: parseInt(e.target.value) || "" })}
                          placeholder="18"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Age</Label>
                        <Input
                          type="number"
                          value={newScheme.maxAge}
                          onChange={(e) => setNewScheme({ ...newScheme, maxAge: parseInt(e.target.value) || "" })}
                          placeholder="65"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddScheme}>Add Scheme</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="card-elevated flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{scheme.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      className={
                        scheme.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : scheme.status === "Draft"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {scheme.status}
                    </Badge>
                  </div>
                </div>
                <CheckSquare className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {scheme.description}
              </p>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Age Range</span>
                  <span className="font-medium">{scheme.minAge} - {scheme.maxAge} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Districts</span>
                  <span className="font-medium">
                    {scheme.districts.includes("all") ? "All" : scheme.districts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium">{scheme.applicants.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(scheme)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(scheme.id)}
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

      {filteredSchemes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No schemes found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Scheme</DialogTitle>
            <DialogDescription>
              Update scheme eligibility criteria and information.
            </DialogDescription>
          </DialogHeader>
          {editingScheme && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheme Name</Label>
                  <Input
                    value={editingScheme.name}
                    onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingScheme.status} 
                    onValueChange={(v) => setEditingScheme({ ...editingScheme, status: v })}
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
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingScheme.description}
                  onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Age</Label>
                  <Input
                    type="number"
                    value={editingScheme.minAge}
                    onChange={(e) => setEditingScheme({ ...editingScheme, minAge: parseInt(e.target.value) || "" })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Age</Label>
                  <Input
                    type="number"
                    value={editingScheme.maxAge}
                    onChange={(e) => setEditingScheme({ ...editingScheme, maxAge: parseInt(e.target.value) || "" })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Available Districts</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingScheme.districts.map((district) => (
                    <Badge key={district} variant="outline" className="gap-1">
                      {district === "all" ? "All Districts" : district}
                      <button
                        onClick={() => setEditingScheme(removeDistrict(editingScheme, district))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select
                  value={districtInput}
                  onValueChange={(value) => {
                    setEditingScheme(addDistrict(editingScheme, value));
                    setDistrictInput("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d} disabled={editingScheme.districts.includes(d) || editingScheme.districts.includes("all")}>
                        {d}
                      </SelectItem>
                    ))}
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


