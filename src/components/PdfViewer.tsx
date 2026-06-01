import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useLanguage } from '@/contexts/LanguageContext';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
}

export function PdfViewer({ fileUrl, className = '' }: PdfViewerProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(720);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setPageCount(0);
    timeoutRef.current = window.setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 12000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [fileUrl]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateWidth = () => {
      setViewerWidth(Math.max(280, Math.min(container.clientWidth - 32, 920)));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const stopLoading = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-muted/50 p-8 ${className}`}>
        <p className="text-muted-foreground">{t('preview.unable')}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-auto bg-muted/30 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/30">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('preview.loading')}</p>
        </div>
      )}

      <Document
        key={fileUrl}
        file={fileUrl}
        loading={null}
        error={null}
        onLoadSuccess={({ numPages }) => {
          setPageCount(numPages);
          stopLoading();
        }}
        onLoadError={() => {
          stopLoading();
          setHasError(true);
        }}
      >
        <div className="flex min-h-[760px] flex-col items-center gap-6 px-4 py-8">
          {Array.from({ length: pageCount }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={viewerWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="overflow-hidden rounded-sm bg-background shadow-lg"
            />
          ))}
        </div>
      </Document>
    </div>
  );
}
