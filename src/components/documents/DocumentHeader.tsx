import React from 'react';
import { AddDocumentModal } from './AddDocumentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, SortAsc, SortDesc, LogOut, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DocumentHeader = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    documents,
    filteredDocuments
  } = useDocuments();
  
  const { user, profile, logout } = useAuth();

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* Header avec utilisateur */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Gestionnaire de Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} • {documents.length} total
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{profile?.display_name || user?.email?.split('@')[0] || 'Utilisateur'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{profile?.display_name || user?.email?.split('@')[0] || 'Utilisateur'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher des documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortField} onValueChange={(value) => setSortField(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="modifiedAt">Date de modification</SelectItem>
              <SelectItem value="createdAt">Date de création</SelectItem>
              <SelectItem value="size">Taille</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="px-3"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>

        <AddDocumentModal>
          <Button variant="gradient" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un document
          </Button>
        </AddDocumentModal>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "secondary"}
          className="cursor-pointer transition-all hover:scale-105"
          onClick={() => handleCategoryFilter(null)}
        >
          Tous ({documents.length})
        </Badge>
        {categories.map((category) => {
          const count = documents.filter(doc => doc.category === category.id).length;
          return (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? category.color as any : "secondary"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => handleCategoryFilter(category.id)}
            >
              {category.name} ({count})
            </Badge>
          );
        })}
      </div>
    </div>
  );
};