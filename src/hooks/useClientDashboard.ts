/**
 * useClientDashboard Hook
 *
 * @description Custom hook for managing client dashboard state and logic
 * @hook
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, DocumentTemplate } from '../lib/supabase';

interface GeneratedDocument {
  id: string;
  document_type: string;
  status: string;
  price: number;
  pdf_url: string | null;
  created_at: string;
}

/**
 * Hook for managing client dashboard state
 *
 * @param {string | undefined} userId - Current user ID
 * @returns {Object} Dashboard state and handlers
 */
export function useClientDashboard(userId: string | undefined) {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'billing' | 'documents'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetches user's generated documents from database
   */
  const fetchDocuments = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetches available document templates
   */
  const fetchTemplates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, []);

  /**
   * Handles page navigation
   */
  const handleNavigation = (page: 'home' | 'profile' | 'billing' | 'documents') => {
    setCurrentPage(page);
    setShowTemplates(false);
    setShowAIGenerator(false);
  };

  // Initial data load
  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
  }, [fetchDocuments, fetchTemplates]);

  return {
    // State
    documents,
    templates,
    loading,
    selectedDocument,
    selectedTemplateId,
    showTemplates,
    showAIGenerator,
    currentPage,
    searchQuery,
    // Setters
    setSelectedDocument,
    setSelectedTemplateId,
    setShowTemplates,
    setShowAIGenerator,
    setSearchQuery,
    // Handlers
    handleNavigation,
    fetchDocuments,
    fetchTemplates,
  };
}
