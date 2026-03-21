'use client';

import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

interface PortalProps {
  children: ReactNode;
}

interface Pair {
  react: ReturnType<typeof createRoot>;
  element: HTMLDivElement;
}

const Portal: FC<PortalProps> = ({ children }) => {
  const rootRef = useRef<Pair | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      const newElement = document.createElement('div');
      document.body.appendChild(newElement);
      const newRoot = createRoot(newElement);

      newElement.className = 'portal-root';

      rootRef.current = { react: newRoot, element: newElement };
    }

    return () => {
      if (rootRef.current) {
        const current = rootRef.current;
        rootRef.current = null;
        current.react.render(null);
        document.body.removeChild(current.element);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.react.render(children);
    }
  }, [rootRef, children]);

  return null;
};

export default Portal;
