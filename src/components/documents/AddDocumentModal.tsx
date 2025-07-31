import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDocuments } from '@/contexts/DocumentContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload } from 'lucide-react';

interface AddDocumentModalProps {
  children: React.ReactNode;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { addDocument, categories } = useDocuments();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
      
      // Déterminer la catégorie basée sur le type de fichier
      const fileType = selectedFile.type;
      if (fileType.includes('pdf')) {
        setCategory('pdf');
      } else if (fileType.includes('image')) {
        setCategory('image');
      } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
        setCategory('presentation');
      } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
        setCategory('spreadsheet');
      } else if (fileType.includes('zip') || fileType.includes('rar')) {
        setCategory('archive');
      } else {
        setCategory('document');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du document est requis",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      const documentData = {
        name: name.trim(),
        type: category,
        size: file ? file.size : Math.floor(Math.random() * 5000000) + 100000, // Taille aléatoire si pas de fichier
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        category,
        description: description.trim() || undefined,
        isFavorite: false,
      };

      addDocument(documentData);

      toast({
        title: "Document ajouté",
        description: `Le document "${name}" a été ajouté avec succès`,
      });

      // Réinitialiser le formulaire
      setName('');
      setDescription('');
      setCategory('');
      setTags('');
      setFile(null);
      setOpen(false);

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Ajouter un nouveau document</span>
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau document à votre collection. Vous pouvez uploader un fichier ou créer une entrée manuellement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload de fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">Fichier (optionnel)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground"
              />
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    const fileInput = document.getElementById('file') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </div>

          {/* Nom du document */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du document *</Label>
            <Input
              id="name"
              placeholder="Ex: Rapport_mensuel.pdf"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label>Catégorie *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="important, projet, 2024 (séparés par des virgules)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter le document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};