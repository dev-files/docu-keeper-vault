import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import { 
  Heart, 
  MoreVertical, 
  Download, 
  Edit, 
  Trash2, 
  FileText, 
  Image, 
  File, 
  Table, 
  Presentation,
  Archive 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
  document: Document;
}

const getFileIcon = (type: string) => {
  const icons = {
    pdf: FileText,
    image: Image,
    document: File,
    spreadsheet: Table,
    presentation: Presentation,
    archive: Archive,
  };
  const Icon = icons[type as keyof typeof icons] || File;
  return <Icon className="w-8 h-8" />;
};

const getCategoryColor = (category: string) => {
  const colors = {
    pdf: 'destructive',
    image: 'success',
    document: 'primary',
    spreadsheet: 'warning',
    presentation: 'secondary',
    archive: 'muted',
  };
  return colors[category as keyof typeof colors] || 'secondary';
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { toggleFavorite, deleteDocument } = useDocuments();

  const handleFavoriteToggle = () => {
    toggleFavorite(document.id);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      deleteDocument(document.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${getCategoryColor(document.category)}/10 text-${getCategoryColor(document.category)}`}>
              {getFileIcon(document.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate" title={document.name}>
                {document.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(document.size)} • {document.modifiedAt.toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`h-8 w-8 p-0 ${document.isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 ${document.isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {document.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {document.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {document.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};