// Content bridge for NYN Impact editor integration
// Listens for postMessage from the editor iframe parent
// and updates content in real-time

import { useState, useEffect, createContext, useContext } from 'react';

export interface SiteContent {
  testimonials: any[];
  services: any[];
  destinations: any[];
  faqs: any[];
  instagramPosts: any[];
  blogPosts: any[];
  hero?: any;
  meta?: any;
  stats?: any;
  [key: string]: any;
}

const ContentContext = createContext<{
  content: SiteContent;
  updateContent: (path: string, value: any) => void;
} | null>(null);

export function ContentProvider({ 
  children, 
  defaultContent 
}: { 
  children: React.ReactNode; 
  defaultContent: SiteContent 
}) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    // Try loading from siteContent.json (for published overrides)
    fetch('/siteContent.json')
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('not found');
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setContent(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        // No siteContent.json — use defaults (normal for dev)
      });

    // Listen for real-time updates from NYN Impact editor
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'nyn-content-update') {
        const { path, value, fullContent } = event.data;
        
        if (fullContent) {
          // Full content replacement
          setContent(prev => ({ ...prev, ...fullContent }));
        } else if (path && value !== undefined) {
          // Single field update
          setContent(prev => {
            const updated = { ...prev };
            setNestedValue(updated, path, value);
            return updated;
          });
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function updateContent(path: string, value: any) {
    setContent(prev => {
      const updated = { ...prev };
      setNestedValue(updated, path, value);
      return updated;
    });
  }

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be inside ContentProvider');
  return ctx;
}

function setNestedValue(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const idx = parseInt(key);
    if (!isNaN(idx)) {
      if (!Array.isArray(current)) return;
      if (!current[idx]) current[idx] = {};
      current = current[idx];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  const lastIdx = parseInt(lastKey);
  if (!isNaN(lastIdx) && Array.isArray(current)) {
    current[lastIdx] = value;
  } else {
    current[lastKey] = value;
  }
}
