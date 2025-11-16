/**
 * AllDocumentsList Component
 *
 * @description Displays all document templates grouped by category
 * @component
 */

import { DocumentList } from './DocumentList';

interface AllDocumentsListProps {
  /** Handler for template selection */
  onTemplateSelect: (templateId: string) => void;
}

/**
 * Renders all document templates organized by category
 *
 * @param {AllDocumentsListProps} props - Component props
 * @returns {JSX.Element} Documents list UI
 */
export function AllDocumentsList({ onTemplateSelect }: AllDocumentsListProps) {
  return (
    <div className="space-y-8">
      <DocumentList
        category="professional"
        title="Documents Professionnels"
        onTemplateSelect={onTemplateSelect}
      />
      <DocumentList
        category="personal"
        title="Documents Personnels"
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
}
