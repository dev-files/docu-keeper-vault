import React from 'react';
import { DocumentCard } from './DocumentCard';
import { useDocuments } from '@/contexts/DocumentContext';
import { FileX } from 'lucide-react';

export const DocumentGrid = () => {
  const { filteredDocuments } = useDocuments();

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Aucun document trouvé
        </h3>
        <p className="text-muted-foreground">
          Ajoutez des documents ou modifiez vos filtres de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDocuments.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};