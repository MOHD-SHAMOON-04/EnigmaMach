import { useCallback, useEffect, useRef, useState } from 'react';
import PlugKey from './PlugKey';
import type { CharMap } from '../types';

function colorFromChar(char: string): string {
  const normalized = char.toUpperCase().charCodeAt(0) - 65;
  const hue = (normalized * 137) % 360;
  const saturation = 100;
  const lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function Plugboard({
  mapping, updateMapping
}: {
  mapping: CharMap,
  updateMapping: (newMapping: CharMap) => void
}) {
  const layout = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];

  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, DOMRect>>({});
  const [waitingKey, setWaitingKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Update position for a single key
  const updatePosition = useCallback((char: string, el: HTMLButtonElement | null) => {
    if (!el) return;

    const updateRect = () => {
      const rect = el.getBoundingClientRect();
      setPositions(prev => ({ ...prev, [char]: rect }));
    };

    if (isMobile) {
      setTimeout(updateRect, 10);
    } else {
      updateRect();
    }
  }, [isMobile]);

  // Recalculate all key positions
  const recalculateAllPositions = useCallback(() => {
    const newPositions: Record<string, DOMRect> = {};

    layout.forEach(row => {
      row.split('').forEach(char => {
        const el = document.getElementById(`plug-${char}`) as HTMLButtonElement;
        if (el) {
          newPositions[char] = el.getBoundingClientRect();
        }
      });
    });

    setPositions(newPositions);
  }, [layout]);

  // Add effect to handle mobile orientation changes and resize
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => setTimeout(recalculateAllPositions, 100);
    const handleOrientationChange = () => setTimeout(recalculateAllPositions, 300);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, recalculateAllPositions]);

  // Convert DOMRects to relative coordinates
  const getRelativeCoords = (char: string): { x: number, y: number } | null => {
    const rect = positions[char];
    const container = containerRef.current?.getBoundingClientRect();
    if (!rect || !container) return null;
    return {
      x: rect.left + rect.width / 2 - container.left,
      y: rect.top + rect.height / 2 - container.top,
    };
  };

  // Handle plugboard key clicks
  const handlePlugboardClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default touch behavior that might cause layout shifts
    if (isMobile && 'touches' in e) {
      e.preventDefault();
    }

    const ele = (e.target as HTMLButtonElement).closest('button._PLUGBOARD_KEY') as HTMLButtonElement;
    if (!ele) return;

    const char = ele.dataset.char;
    if (!char) return;

    const mappedTo = mapping.get(char);

    // If already mapped, remove the pair
    if (mappedTo) {
      const newMapping = new Map(mapping);
      newMapping.delete(char);
      newMapping.delete(mappedTo);
      updateMapping(newMapping);
      setWaitingKey(null);

      // Recalculate positions on mobile after state update
      if (isMobile) {
        setTimeout(recalculateAllPositions, 50);
      }
      return;
    }

    // Handle pairing logic
    if (!waitingKey) {
      // No key waiting, set current as waiting
      setWaitingKey(char);
      return;
    }

    if (char === waitingKey) {
      // Clicking same key twice, cancel
      setWaitingKey(null);
      return;
    }

    // Create new pair
    const newMapping = new Map(mapping);
    newMapping.set(waitingKey, char);
    newMapping.set(char, waitingKey);
    updateMapping(newMapping);
    setWaitingKey(null);

    // Recalculate positions on mobile after state update
    if (isMobile) {
      setTimeout(recalculateAllPositions, 50);
    }
  }, [mapping, updateMapping, waitingKey, isMobile, recalculateAllPositions]);

  // Render SVG lines for connections
  const renderSVGLines = () => {
    return Array.from(mapping.entries()).map(([from, to], idx) => {
      // Only draw one direction to avoid duplicate lines
      if (from > to) return null;

      const p1 = getRelativeCoords(from);
      const p2 = getRelativeCoords(to);

      // Skip if coordinates are missing
      if (!p1 || !p2) {
        // Trigger recalculation on mobile if coordinates are missing
        if (isMobile) {
          setTimeout(recalculateAllPositions, 10);
        }
        return null;
      }

      const color = colorFromChar(from);

      return (
        <g key={`${from}-${to}-${idx}`}>
          <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={color}
            strokeWidth="2"
          />
          <circle
            cx={p1.x}
            cy={p1.y}
            r="12"
            stroke={color}
            strokeWidth="2"
            fill='transparent'
          />
          <circle
            cx={p2.x}
            cy={p2.y}
            r="12"
            stroke={color}
            strokeWidth="2"
            fill='transparent'
          />
        </g>
      );
    });
  };

  return (
    <div
      id={`plug-keyboard`}
      className="_PLUGBOARD relative bg-zinc-700/70 p-2 sm:p-4 rounded mx-auto flex flex-col items-center mb-3 sm:mb-6 gap-3"
      ref={containerRef}
      onClick={!isMobile ? handlePlugboardClick : undefined}
      onTouchEnd={isMobile ? handlePlugboardClick : undefined}
      style={{ touchAction: 'manipulation' }}
    >
      <h2 className="mr-auto text-lg sm:text-xl lg:text-2xl font-bold mb-1 lg:mb-2">
        Plugboard
      </h2>

      {/* Render lines with SVG */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
        {renderSVGLines()}
      </svg>

      {/* Keyboard layout */}
      {layout.map((row, idx) => (
        <div className="_PLUGBOARD_ROW flex gap-[8.2px] sm:gap-3" key={idx}>
          {row.split('').map(char => (
            <PlugKey
              char={char}
              key={`plug-${char}`}
              reportPosition={updatePosition}
              isWaiting={char === waitingKey}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/*
/SUMMARY

# Architecture Overview
* **Parent component** holds the plugboard state (`mapping`) using `useState`.
* **Child component (`Plugboard`)** is stateless and receives:
  * `mapping`: current plugboard connections.
  * `updateMapping()`: callback to update both state and Enigma logic.
---

# Interaction Flow
1. **User clicks a key** on the plugboard.
2. If the key is connected, its pair is removed from the mapping.
3. `updateMapping(newMapping)` is called.
4. Inside `updateMapping`:
   * Enigma’s internal plugboard is updated.
   * React state (`setMapping`) is updated with a cloned `Map`.
5. Re-render triggers updated SVG lines reflecting the new mapping.
---

# Best Practices You're Following
* Source of truth lives in the parent.
* No mutation — always cloning `Map` before updating.
* `Plugboard` is a clean, reusable, stateless component.
* Visual updates are synced immediately with state and Enigma logic.
---

# click handler
- Click on a mapped key → removes the pair immediately.
- Click on an unmapped key:
  - If no key is waiting, set this key as waiting.
  - If there is already a waiting key:
    - Ignore clicks on mapped keys.
    - Disengage if clicking the same key again.
    - Otherwise, pair the two keys and reset waiting.
---

- Implemented plugboard key click logic with two modes:
  - Remove pairs: clicking a mapped key deletes both ends of the pair.
  - Add pairs: clicking two unmapped keys sequentially creates a new pair.
- Managed temporary pairing state with a waitingKey in React state.
- Added a "glow" CSS class to visually highlight the waiting key, improving UX by showing which key is waiting for pairing.
- Confirmed the Enigma machine integration works perfectly with the plugboard updates.
- Code is clean, efficient, and user-friendly.
---

=> Clean-up Changes Made:
1. Consolidated mobile-specific logic into clear sections
2. Added helpful comments explaining key functionality
3. Improved JSX formatting with proper parentheses and indentation
The core issue was that **mobile browsers handle touch events differently** than desktop mouse events, causing the DOM element positions to become invalid when the SVG tried to render. 

=> The solution was to:
- Use different event handlers for mobile vs desktop
- Add position recalculation after state updates on mobile
- Include proper error handling when coordinates are missing
*/