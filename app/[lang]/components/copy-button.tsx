'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface CopyButtonProps {
  text: string;
  ariaLabel: string;
}

export const CopyButton = ({ text, ariaLabel }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      variant="ghost"
      aria-label={ariaLabel}
    >
      {copied ? <Check className="h-4 w-4 text-slate-400 " /> : <Copy className="h-4 w-4 text-slate-400 " />}
    </Button>
  );
}
