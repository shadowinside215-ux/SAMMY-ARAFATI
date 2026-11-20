import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { prefersReducedMotion } from '../three/webglUtils';

interface TechWindowProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Bidirectional futuristic window reveal.
 * Observes a static outer wrapper so transforms never cause edge flicker,
 * and pops the inner window smoothly into view both when scrolling down
 * and when scrolling back up.
 */
export const TechWindow: React.FC<TechWindowProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [reduced] = useState(() => prefersReducedMotion());
  const [visible, setVisible] = useState(() => reduced);
  const [entryDirection, setEntryDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const el = outerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          // Position off-screen offset based on which side the window exited
          const exitedAbove = entry.boundingClientRect.top < 0;
          setEntryDirection(exitedAbove ? 'up' : 'down');
          setVisible(false);
        }
      },
      {
        threshold: 0.02,
        rootMargin: '0px 0px -24px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const hiddenY = entryDirection === 'up' ? -28 : 28;
  const hiddenRotateX = entryDirection === 'up' ? -4 : 4;

  return (
    <div
      ref={outerRef}
      style={{ perspective: '1200px' }}
      className={className}
    >
      <motion.div
        initial={false}
        animate={
          visible
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
              }
            : {
                opacity: 0,
                y: hiddenY,
                scale: 0.955,
                rotateX: hiddenRotateX,
              }
        }
        transition={{
          duration: visible ? 0.54 : 0.26,
          delay: visible ? delay : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ transformOrigin: 'center center' }}
        className="h-full relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
