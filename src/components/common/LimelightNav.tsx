import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

export type LimelightNavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items: LimelightNavItem[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
};

export function LimelightNav({ items, activeIndex = 0, onTabChange }: LimelightNavProps) {
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
      if (!isReady) setTimeout(() => setIsReady(true), 50);
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) return null;

  return (
    <nav
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: 64,
        borderRadius: 'var(--radius-2xl)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--shadow-md)',
        paddingLeft: 8,
        paddingRight: 8,
        width: '100%',
      }}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <a
          key={id}
          ref={(el) => (navItemRefs.current[index] = el)}
          onClick={() => {
            onTabChange?.(index);
            onClick?.();
          }}
          aria-label={label}
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            flex: 1,
            height: '100%',
            cursor: 'pointer',
            padding: '0 8px',
            userSelect: 'none',
          }}
        >
          {cloneElement(icon, {
            style: {
              width: 22,
              height: 22,
              transition: 'opacity 0.15s ease, color 0.15s ease',
              opacity: activeIndex === index ? 1 : 0.38,
              color: activeIndex === index ? 'var(--primary)' : 'var(--on-surface)',
              ...(icon.props.style ?? {}),
            },
          })}
          {label && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'opacity 0.15s ease, color 0.15s ease',
                opacity: activeIndex === index ? 1 : 0.38,
                color: activeIndex === index ? 'var(--primary)' : 'var(--on-surface)',
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          )}
        </a>
      ))}

      {/* Limelight bar + cone glow */}
      <div
        ref={limelightRef}
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 10,
          width: 44,
          height: 4,
          borderRadius: 9999,
          background: 'var(--primary)',
          boxShadow: '0 30px 18px rgba(0, 107, 10, 0.28)',
          left: '-999px',
          transition: isReady ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        {/* Light cone */}
        <div
          style={{
            position: 'absolute',
            left: '-30%',
            top: 4,
            width: '160%',
            height: 52,
            clipPath: 'polygon(5% 100%, 25% 0, 75% 0, 95% 100%)',
            background:
              'linear-gradient(to bottom, rgba(0, 107, 10, 0.22), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </nav>
  );
}
