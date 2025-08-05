import React, { useState, useCallback, useRef, useEffect } from "react";

// --- Type Definitions ---
interface PegColor {
  name: string;
  value: string;
}

type Board = (string | null)[][];

// --- Constants ---
// Define the available peg colors and their corresponding names for tooltips
const PEG_COLORS: PegColor[] = [
  { name: "White", value: "#FFFFFF" },
  { name: "Hot Pink", value: "#FF69B4" },
  { name: "Red", value: "#FF0000" },
  { name: "Orange", value: "#FFA500" },
  { name: "Gold", value: "#FFD700" },
  { name: "Lawn Green", value: "#7CFC00" },
  { name: "Deep Sky Blue", value: "#00BFFF" },
  { name: "Medium Purple", value: "#9370DB" },
];

// --- Helper Functions ---
/**
 * Creates an empty board state with dynamic dimensions.
 * @param rows Number of rows
 * @param cols Number of columns
 * @returns {Board} A 2D array filled with null values.
 */
const createEmptyBoard = (rows: number, cols: number): Board =>
  Array.from({ length: rows }, () => Array(cols).fill(null));

/**
 * Calculates how many pegs can fit in a container
 * @param containerWidth Container width in pixels
 * @param containerHeight Container height in pixels
 * @param pegDiameter Diameter of each peg in svh units
 * @param gap Gap between pegs in svh units
 * @returns Object with rows and columns that can fit
 */
const calculatePegGrid = (
  containerWidth: number,
  containerHeight: number,
  pegDiameter: number = 2,
  gap: number = 0.2
): { rows: number; cols: number } => {
  // Convert svh to pixels (approximate - 1svh = 1% of small viewport height)
  const svhToPx = window.innerHeight / 100;
  const pegSizePx = pegDiameter * svhToPx;
  const gapPx = gap * svhToPx;

  // Calculate how many pegs can fit
  const cols = Math.floor((containerWidth - gapPx) / (pegSizePx + gapPx));
  const rows = Math.floor((containerHeight - gapPx) / (pegSizePx + gapPx));

  return { rows: Math.max(1, rows), cols: Math.max(1, cols) };
};

// --- Component Prop Interfaces ---
interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

interface PegProps {
  pegColor: string | null;
  x: number;
  y: number;
  onPegClick: (row: number, col: number) => void;
  pegSize: number;
  gap: number;
}

interface LiteBriteBoardProps {
  board: Board;
  onPegClick: (row: number, col: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

// --- Components ---

/**
 * ColorPalette Component
 * Renders the selectable color buttons with a 3D-like spherical appearance.
 */
const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onColorSelect,
}) => (
  <div className="w-full md:w-fit flex items-center justify-center flex-row gap-[1svh] md:gap-[2svh] md:px-[2svh]">
    <span className="text-cyan-300">colors:</span>
    {PEG_COLORS.map(({ name, value }) => (
      <button
        key={value}
        title={name}
        onClick={() => onColorSelect(value)}
        onTouchStart={(e) => {
          // Prevent double-tap zoom on mobile
          e.preventDefault();
        }}
        className="w-4 h-4 md:w-8 md:h-8 rounded-full transition-all duration-200 ease-in-out transform focus:outline-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, white, ${value} 90%)`,
          border: selectedColor === value ? "4px solid #333" : "2px solid #FFF",
          boxShadow:
            selectedColor === value
              ? `0 0 15px ${value}, 0 0 20px ${value}`
              : "0 1px 3px rgba(0,0,0,0.2)",
          transform: selectedColor === value ? "scale(1.15)" : "scale(1.0)",
          // Ensure minimum touch target size
          minWidth: "2svh",
          minHeight: "2svh",
        }}
      />
    ))}
  </div>
);

/**
 * Peg Component
 * Renders a single peg (or an empty hole) with a pseudo-3D effect.
 */
const Peg: React.FC<PegProps> = React.memo(
  ({ pegColor, x, y, onPegClick, pegSize, gap }) => {
    const cx = x * (pegSize + gap) + pegSize / 2 + gap;
    const cy = y * (pegSize + gap) + pegSize / 2 + gap;
    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      setIsPressed(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      e.preventDefault();
      setIsPressed(false);
      onPegClick(y, x);
    };

    const handleClick = () => {
      onPegClick(y, x);
    };

    return (
      <g
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="cursor-pointer group"
      >
        <circle
          cx={cx}
          cy={cy}
          r={pegSize / 2}
          fill={
            pegColor ? `url(#grad-${pegColor.substring(1)})` : "url(#grad-hole)"
          }
          strokeWidth="2"
          style={{
            filter: pegColor ? `drop-shadow(0 0 8px ${pegColor})` : "none",
            transform: isPressed ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.1s ease-in-out",
          }}
          className={`
          transition-all duration-100 ease-in-out
          ${
            pegColor
              ? "stroke-transparent group-hover:stroke-white/75"
              : "stroke-transparent group-hover:fill-[#444]"
          }
          md:scale-100 scale-125
        `}
        />
      </g>
    );
  }
);

/**
 * LiteBriteBoard Component
 * Renders the main SVG pegboard and defines the gradients for the pegs.
 */
const LiteBriteBoard: React.FC<LiteBriteBoardProps> = ({
  board,
  onPegClick,
  containerRef,
}) => {
  const [dimensions, setDimensions] = useState({ rows: 1, cols: 1 });
  const [pegSize, setPegSize] = useState(20);
  const [gap, setGap] = useState(4);

  // Calculate peg size in pixels (2svh diameter)
  const pegDiameterSvh = 2;
  const gapSvh = 0.2;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const svhToPx = window.innerHeight / 100;
        const pegSizePx = pegDiameterSvh * svhToPx;
        const gapPx = gapSvh * svhToPx;

        setPegSize(pegSizePx);
        setGap(gapPx);

        const { rows, cols } = calculatePegGrid(
          rect.width,
          rect.height,
          pegDiameterSvh,
          gapSvh
        );
        setDimensions({ rows, cols });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [containerRef]);

  const width = dimensions.cols * (pegSize + gap) + gap;
  const height = dimensions.rows * (pegSize + gap) + gap;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl shadow-inner-lg"
    >
      <defs>
        <radialGradient id="grad-hole">
          <stop offset="0%" stopColor="#0f1f2a" />
          <stop offset="85%" stopColor="#050a0f" />
        </radialGradient>
        {PEG_COLORS.map(({ value }) => (
          <radialGradient
            key={`grad-${value}`}
            id={`grad-${value.substring(1)}`}
          >
            <stop offset="0%" stopColor={value} />
            <stop offset="100%" stopColor={value} />
          </radialGradient>
        ))}
      </defs>

      {board.map((row, y) =>
        row.map((pegColor, x) => (
          <Peg
            key={`${y}-${x}`}
            pegColor={pegColor}
            x={x}
            y={y}
            onPegClick={onPegClick}
            pegSize={pegSize}
            gap={gap}
          />
        ))
      )}
    </svg>
  );
};

/**
 * Main App Component
 * This is the root component that brings everything together.
 */
export default function App(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(1, 1));
  const [selectedColor, setSelectedColor] = useState<string>(
    PEG_COLORS[0].value
  );

  const handlePegClick = useCallback(
    (row: number, col: number) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);
        newBoard[row][col] =
          prevBoard[row][col] === selectedColor ? null : selectedColor;
        return newBoard;
      });
    },
    [selectedColor]
  );

  const handleClearBoard = (): void => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pegDiameterSvh = 2;
      const gapSvh = 0.2;

      const { rows, cols } = calculatePegGrid(
        rect.width,
        rect.height,
        pegDiameterSvh,
        gapSvh
      );
      setBoard(createEmptyBoard(rows, cols));
    }
  };

  // Update board when container dimensions change
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pegDiameterSvh = 2;
      const gapSvh = 0.2;

      const { rows, cols } = calculatePegGrid(
        rect.width,
        rect.height,
        pegDiameterSvh,
        gapSvh
      );
      setBoard(createEmptyBoard(rows, cols));
    }
  }, []);

  return (
    <div
      className="fixed inset-0 h-100svh w-100vw flex flex-col items-center justify-center rounded-none"
      style={{
        background:
          "linear-gradient(to bottom,rgb(27, 32, 42),rgb(24, 23, 37), rgb(27, 32, 42))",
      }}
    >
      <div className="w-100vw md:w-90% h-100svh">
        <main className="w-full h-full">
          <div className="flex flex-col md:flex-row items-center justify-between px-[1svh] md:px-[3svh] py-[1svh] w-full">
            <div className="flex flex-col items-center md:items-start gap-0.5svh md:gap-0">
              <span
                className="text-[3svh] font-bold"
                style={{ color: "#f894ff" }}
              >
                Tribute to Lite Brite
              </span>
              <span
                className="text-[1.5svh] font-bold"
                style={{ color: "cyan" }}
              >
                Evan Marie Carr: https://github.com/EvanMarie
              </span>
            </div>
            <ColorPalette
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
            <button
              onClick={handleClearBoard}
              onTouchStart={(e) => {
                // Prevent double-tap zoom on mobile
                e.preventDefault();
              }}
              className="text-black font-bold py-[0.5svh] px-[2svh] rounded-[3svh] text-[2svh] transition-colors shadow-lg"
              style={{
                boxShadow: "0 0 10pxrgb(52, 41, 53)",
                textShadow: "0 0 10px #f894ff",
                transform: "scale(1.1)",
                transition: "all 0.2s ease-in-out",
                backgroundColor: "#f894ff",
                border: "2px solid #f894ff",
                borderRadius: "3svh",
                padding: "0 2svh",
                fontSize: "1.6svh",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Clear Board
            </button>
          </div>
          <div ref={containerRef} className="w-full h-75svh md:h-85svh">
            <LiteBriteBoard
              board={board}
              onPegClick={handlePegClick}
              containerRef={containerRef}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
