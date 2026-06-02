import { useState, useEffect, useRef } from 'react';

let pdfjsLib: any = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

interface UsePDFPageTextProps {
  pdfUrl: string;
  pageNumber: number;
}

export function usePDFPageText({ pdfUrl, pageNumber }: UsePDFPageTextProps) {
  const [pageText, setPageText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const pdfRef = useRef<any>(null);

  useEffect(() => {
    const extractText = async () => {
      try {
        setIsLoading(true);
        const pdfjs = await getPdfjs();

        // Cargar el PDF si aún no está cargado
        if (!pdfRef.current) {
          pdfRef.current = await pdfjs.getDocument(pdfUrl).promise;
        }

        const pdf = pdfRef.current;
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const items = textContent.items as any[];
        if (!items || items.length === 0) {
          setPageText('');
          return;
        }

        // Extraer TODO el texto sin límites de líneas
        // Priorizar extraer TODO sobre mantener estructura perfecta
        let text = '';

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const nextItem = items[i + 1];

          text += item.str || '';

          // Agregar espacio si hay gap significativo entre items
          if (nextItem) {
            const gapX = (nextItem.x || 0) - ((item.x || 0) + (item.width || 0));
            const gapY = (nextItem.y || 0) - (item.y || 0);

            // Salto de línea si el Y cambió significativamente
            if (Math.abs(gapY) > 3) {
              text += '\n';
            } else if (gapX > 10) {
              // Espacio si hay gap horizontal
              text += ' ';
            }
          }
        }

        // Limpiar: remover líneas vacías extras pero mantener contenido
        const cleanedText = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n\n');

        setPageText(cleanedText);
      } catch (error) {
        console.error('Error extracting text:', error);
        setPageText('');
      } finally {
        setIsLoading(false);
      }
    };

    extractText();
  }, [pdfUrl, pageNumber]);

  return {
    pageText,
    isLoading,
  };
}
