import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
}

export function PdfViewer({ fileUrl, className = '' }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [fileUrl]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-muted/50 p-8 ${className}`}>
        <p className="text-muted-foreground">Unable to load the PDF.</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/30">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      )}

      <iframe
        key={fileUrl}
        title="Resume preview"
        src={fileUrl}
        className="h-full min-h-[760px] w-full border-0"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
