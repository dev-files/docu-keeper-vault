import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document, DocumentCategory, DocumentSortField, SortOrder } from '@/types/document';

interface DocumentContextType {
  documents: Document[];
  categories: DocumentCategory[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'modifiedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;
  filteredDocuments: Document[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortField: DocumentSortField;
  setSortField: (field: DocumentSortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

const defaultCategories: DocumentCategory[] = [
  { id: 'pdf', name: 'PDF', color: 'destructive', icon: 'FileText' },
  { id: 'image', name: 'Images', color: 'success', icon: 'Image' },
  { id: 'document', name: 'Documents', color: 'primary', icon: 'File' },
  { id: 'spreadsheet', name: 'Tableurs', color: 'warning', icon: 'Table' },
  { id: 'presentation', name: 'Présentations', color: 'secondary', icon: 'Presentation' },
  { id: 'archive', name: 'Archives', color: 'muted', icon: 'Archive' },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Rapport_annuel_2024.pdf',
    type: 'pdf',
    size: 2547200,
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-20'),
    tags: ['rapport', 'annuel', '2024'],
    category: 'pdf',
    description: 'Rapport annuel de l\'entreprise pour 2024',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Presentation_projet.pptx',
    type: 'presentation',
    size: 5242880,
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-18'),
    tags: ['présentation', 'projet'],
    category: 'presentation',
    description: 'Présentation du nouveau projet',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Budget_2024.xlsx',
    type: 'spreadsheet',
    size: 1048576,
    createdAt: new Date('2024-01-05'),
    modifiedAt: new Date('2024-01-25'),
    tags: ['budget', 'finances', '2024'],
    category: 'spreadsheet',
    description: 'Budget prévisionnel pour 2024',
    isFavorite: true,
  },
];

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<DocumentSortField>('modifiedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const categories = defaultCategories;

  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'modifiedAt'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, ...updates, modifiedAt: new Date() } : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const toggleFavorite = (id: string) => {
    updateDocument(id, { isFavorite: !documents.find(doc => doc.id === id)?.isFavorite });
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt' || sortField === 'modifiedAt') {
        aValue = (aValue as Date).getTime();
        bValue = (bValue as Date).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('documents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const documentsWithDates = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          modifiedAt: new Date(doc.modifiedAt),
        }));
        setDocuments(documentsWithDates);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
      }
    }
  }, []);

  return (
    <DocumentContext.Provider value={{
      documents,
      categories,
      addDocument,
      updateDocument,
      deleteDocument,
      toggleFavorite,
      filteredDocuments,
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      sortField,
      setSortField,
      sortOrder,
      setSortOrder,
    }}>
      {children}
    </DocumentContext.Provider>
  );
};