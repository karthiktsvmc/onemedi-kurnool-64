import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  productCount: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  module: string;
  subcategories: string[];
  createdAt: string;
  updatedAt: string;
}

const modules = [
  'medicines',
  'lab-tests',
  'scans',
  'doctors',
  'homecare',
  'diabetes-care',
  'hospitals',
  'ambulance',
  'blood-banks',
  'insurance'
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Pain Relief',
    description: 'Medicines for pain management and relief',
    icon: '💊',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
    color: 'hsl(var(--red-500))',
    productCount: 145,
    isActive: true,
    isFeatured: true,
    order: 1,
    module: 'medicines',
    subcategories: ['Headache', 'Body Pain', 'Joint Pain'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Blood Tests',
    description: 'Essential blood work and diagnostic tests',
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop',
    color: 'hsl(var(--blue-500))',
    productCount: 89,
    isActive: true,
    isFeatured: false,
    order: 2,
    module: 'lab-tests',
    subcategories: ['CBC', 'Blood Sugar', 'Thyroid'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'MRI Scans',
    description: 'Magnetic resonance imaging services',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop',
    color: 'hsl(var(--green-500))',
    productCount: 45,
    isActive: true,
    isFeatured: true,
    order: 3,
    module: 'scans',
    subcategories: ['Brain MRI', 'Spine MRI', 'Joint MRI'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-19'
  }
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === 'all' || category.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const handleToggleActive = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleToggleFeatured = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isFeatured: !cat.isFeatured } : cat
    ));
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat.id === id);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < categories.length - 1)) {
      const newCategories = [...categories];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newCategories[index], newCategories[swapIndex]] = [newCategories[swapIndex], newCategories[index]];
      
      // Update order numbers
      newCategories.forEach((cat, idx) => {
        cat.order = idx + 1;
      });
      
      setCategories(newCategories);
    }
  };

  const CategoryForm = ({ category, onClose }: { category?: Category; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || '',
      image: category?.image || '',
      color: category?.color || 'hsl(var(--primary))',
      module: category?.module || 'medicines',
      subcategories: category?.subcategories?.join(', ') || '',
      isActive: category?.isActive ?? true,
      isFeatured: category?.isFeatured ?? false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const subcategoriesArray = formData.subcategories.split(',').map(s => s.trim()).filter(Boolean);
      
      if (category) {
        // Edit existing category
        setCategories(prev => prev.map(cat => 
          cat.id === category.id 
            ? { 
                ...cat, 
                ...formData,
                subcategories: subcategoriesArray,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : cat
        ));
      } else {
        // Add new category
        const newCategory: Category = {
          id: Date.now().toString(),
          ...formData,
          subcategories: subcategoriesArray,
          productCount: 0,
          order: categories.length + 1,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setCategories(prev => [...prev, newCategory]);
      }
      
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="module">Module</Label>
            <Select value={formData.module} onValueChange={(value) => setFormData(prev => ({ ...prev, module: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modules.map(module => (
                  <SelectItem key={module} value={module}>
                    {module.replace('-', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="🏥"
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="color">Color (HSL)</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              placeholder="hsl(var(--primary))"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subcategories">Subcategories (comma-separated)</Label>
          <Input
            id="subcategories"
            value={formData.subcategories}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategories: e.target.value }))}
            placeholder="Headache, Body Pain, Joint Pain"
          />
        </div>

        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{category ? 'Update' : 'Create'} Category</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category & Module Management"
        description="Manage categories across all service modules"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Total Categories">{categories.length.toString()}</AdminCard>
        <AdminCard title="Active Categories">{categories.filter(c => c.isActive).length.toString()}</AdminCard>
        <AdminCard title="Featured Categories">{categories.filter(c => c.isFeatured).length.toString()}</AdminCard>
        <AdminCard title="Total Products">{categories.reduce((sum, c) => sum + c.productCount, 0).toString()}</AdminCard>
      </div>

      <Tabs value={selectedModule} onValueChange={setSelectedModule}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
            <TabsTrigger value="lab-tests">Labs</TabsTrigger>
            <TabsTrigger value="scans">Scans</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <CategoryForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value={selectedModule} className="mt-0">
          <AdminCard title="Categories">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          {category.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.subcategories.slice(0, 3).map((sub, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{sub}</Badge>
                              ))}
                              {category.subcategories.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{category.subcategories.length - 3}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.module.replace('-', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleActive(category.id)}
                        />
                          <span className="text-sm">{category.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        {category.isFeatured && <Badge className="text-xs">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{category.order}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(category.id, 'up')}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(category.id, 'down')}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            {editingCategory && (
                              <CategoryForm 
                                category={editingCategory} 
                                onClose={() => setEditingCategory(null)} 
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}