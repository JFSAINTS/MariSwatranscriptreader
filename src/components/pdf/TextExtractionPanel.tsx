import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TextExtractionPanelProps {
  text: string;
  pageNumber: number;
}

export function TextExtractionPanel({
  text,
  pageNumber,
}: TextExtractionPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-primary/20 shadow-lg transition-all duration-300 z-20 ${
      expanded ? 'h-60' : 'h-20'
    }`}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-primary/10">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Text from Page {pageNumber}
          </h3>
          <p className="text-xs text-muted-foreground">
            Select text to translate
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-8 w-8 p-0"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-52px)] bg-background/50">
          <p className="text-sm text-foreground leading-relaxed select-text whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
