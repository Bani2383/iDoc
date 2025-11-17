import { jsPDF } from 'jspdf';

export interface DocumentData {
  title: string;
  content: string;
  fields?: Record<string, string>;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string[];
  };
}

class PDFGenerator {
  async generatePDF(documentData: DocumentData): Promise<Blob> {
    const { title, content, fields = {}, metadata = {} } = documentData;

    let processedContent = content;

    Object.entries(fields).forEach(([key, value]) => {
      const regex1 = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      const regex2 = new RegExp(`\\{${key}\\}`, 'g');
      processedContent = processedContent.replace(regex1, value || '');
      processedContent = processedContent.replace(regex2, value || '');
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    if (metadata.author) {
      doc.setProperties({
        title: title,
        author: metadata.author,
        subject: metadata.subject || '',
        keywords: metadata.keywords?.join(', ') || ''
      });
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margins = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };
    const contentWidth = pageWidth - margins.left - margins.right;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const titleLines = doc.splitTextToSize(title, contentWidth);
    let yPosition = margins.top;

    titleLines.forEach((line: string) => {
      const textWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - textWidth) / 2, yPosition);
      yPosition += 8;
    });

    yPosition += 5;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    const paragraphs = processedContent.split('\n\n');

    paragraphs.forEach((paragraph) => {
      if (paragraph.trim()) {
        const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);

        lines.forEach((line: string) => {
          if (yPosition + 10 > pageHeight - margins.bottom) {
            doc.addPage();
            yPosition = margins.top;
          }

          doc.text(line, margins.left, yPosition);
          yPosition += 7;
        });

        yPosition += 5;
      }
    });

    if (metadata.author || metadata.subject) {
      if (yPosition + 30 > pageHeight - margins.bottom) {
        doc.addPage();
        yPosition = margins.top;
      } else {
        yPosition += 10;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      if (metadata.author) {
        doc.text(`Auteur: ${metadata.author}`, margins.left, yPosition);
        yPosition += 6;
      }

      if (metadata.subject) {
        doc.text(`Sujet: ${metadata.subject}`, margins.left, yPosition);
      }
    }

    return doc.output('blob');
  }

  async downloadPDF(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }

  async previewPDF(blob: Blob): Promise<string> {
    return URL.createObjectURL(blob);
  }
}

export const pdfGenerator = new PDFGenerator();
