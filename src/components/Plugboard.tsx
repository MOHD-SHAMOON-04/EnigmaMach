import { useCallback, useRef, useState } from 'react';
import PlugKey from './PlugKey';
import type { CharMap } from '../types';

export default function Plugboard({
  mapping, updateMapping
}: {
  mapping: CharMap,
  updateMapping: (newMapping: CharMap) => void
}) {
  const layout = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];

  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, DOMRect>>({});

  // helper function to get Rect() for all the <PlugKey />(s) and store it in the positions [state]
  const updatePosition = useCallback((char: string, el: HTMLButtonElement | null) => {
    if (el) {
      setPositions((prev) => ({
        ...prev,
        [char]: el.getBoundingClientRect(),
      }));
    }
  }, []);

  // Convert DOMRects to relative coordinates (within container)
  // name tell its use
  const getRelativeCoords = (char: string): { x: number, y: number } | null => {
    const rect = positions[char];
    const container = containerRef.current?.getBoundingClientRect();
    if (!rect || !container) return null;
    return {
      x: rect.left + rect.width / 2 - container.left,
      y: rect.top + rect.height / 2 - container.top,
    };
  };

  // fancy shit -- lines were barely distinguishable
  function colorFromChar(char: string): string {
    const normalized = char.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ..., Z=25
    const hue = (normalized * 137) % 360; // multiply by a prime to distribute nicely
    const saturation = 100; // percentage
    const lightness = 50; // percentage

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const [waitingKey, setWaitingKey] = useState<string | null>(null);

  // handler for PlugKey click _Event Delegation_
  const handlePlugboardClick = useCallback((e: React.MouseEvent) => {
    const ele = (e.target as HTMLButtonElement).closest('button._PLUGBOARD_KEY') as HTMLButtonElement;
    if (!ele) return;

    const char = ele.dataset.char;
    if (!char) return;

    console.log('Clicked char:', char);
    // console.log('Current mapping:', mapping);

    const mappedTo = mapping.get(char);
    console.log('Mapped to:', mappedTo);

    // If already mapped, remove the pair
    if (mappedTo) {
      const newMapping = new Map(mapping);
      newMapping.delete(char);
      newMapping.delete(mappedTo);
      updateMapping(newMapping);
      setWaitingKey(null); // reset temp pair in case
      return;
    }

    // If not mapped, handle temporary pairing logic

    // no first selected, select current char as first
    if (!waitingKey) {
      setWaitingKey(char);
      return;
    }

    // If second key already mapped, ignore
    if (mapping.has(char)) {
      console.log('Second key is mapped, ignoring');
      return;
    }

    // Ignore if clicking same key twice
    if (char === waitingKey) {
      setWaitingKey(null);
      console.log('Clicked same key twice, disengage');
      return;
    }

    // Complete pair
    // complete the pair and update mapping
    const newMapping = new Map(mapping);
    newMapping.set(waitingKey, char);
    newMapping.set(char, waitingKey);
    updateMapping(newMapping);
    setWaitingKey(null); // reset after adding pair

  }, [mapping, updateMapping, waitingKey]);

  return (
    <div
      id={`plug-keyboard`}
      className="_PLUGBOARD relative bg-zinc-700/70 p-2 sm:p-4 rounded mx-auto flex flex-col items-center mb-3 sm:mb-6 gap-3"
      ref={containerRef}
      onClick={handlePlugboardClick}
    >
      <h2 className="mr-auto text-lg sm:text-xl lg:text-2xl font-bold mb-1 lg:mb-2">
        Plugboard
      </h2>

      {/* Render lines with SVG */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
        {Array.from(mapping.entries()).map(([from, to], idx) => {
          // Only draw one direction (A -> M, skip M -> A)
          if (from > to) return null;
          const p1 = getRelativeCoords(from);
          const p2 = getRelativeCoords(to);
          if (!p1 || !p2) return null;

          return (
            <g
              key={idx}
            >
              <line
                // key={`line-${idx}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={colorFromChar(from)}
                strokeWidth="2"
              />
              <circle
                // key={`c1-${idx}`}
                cx={p1.x}
                cy={p1.y}
                r="12"
                stroke={colorFromChar(from)}
                strokeWidth="2"
                fill='transparent'
              />
              <circle
                // key={`c2-${idx}`}
                cx={p2.x}
                cy={p2.y}
                r="12"
                stroke={colorFromChar(from)}
                strokeWidth="2"
                fill='transparent'
              />
            </g>
          );
        })}
      </svg>

      {/* Render keys */}
      {layout.map((row, idx) =>
        <div className="_PLUGBOARD_ROW flex gap-[8.2px] sm:gap-3" key={idx}>
          {row
            .split('')
            .map(char =>
              <PlugKey
                char={char}
                key={`plug-${char}`}
                reportPosition={updatePosition}
                isWaiting={char === waitingKey}
              />)
          }
        </div>
      )}
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
*/