/**
 * Home screen layout engine.
 *
 * The Home screen must NEVER scroll vertically, so every element is sized from the
 * height the screen actually gave us (measured once via `onLayout`) instead of from
 * hard-coded constants. Everything below is derived in a single pass so the pieces
 * can never overlap each other:
 *
 *   [ circle grid ]  2 rows x 2 columns, each cell = circle + a title block whose
 *                    height is reserved up-front (2 lines) — this is what stops a
 *                    circle from ever sitting on top of a neighbouring title.
 *   [ square row  ]  height grows with the font scale, not a fixed 145.
 *
 * The footer lives outside this box as a normal flex child, so it physically cannot
 * overlay the square cards.
 */
import { useMemo } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const lineHeight = (fontSize: number) => Math.ceil(fontSize * 1.3);

/* ---------------- tuning constants ---------------- */
const H_PADDING = 16;
const COL_GAP = 12;
const ROW_GAP = 10;
const SECTION_GAP = 14;

// circle grid
const CIRCLE_TITLE_BASE_FONT = 13;
const CIRCLE_TITLE_LINES = 2;
const CIRCLE_TITLE_GAP = 6;
const CIRCLE_MAX = 150;
const CIRCLE_MIN = 62;

// square (shortcut) row
const SQUARE_TITLE_BASE_FONT = 12;
const SQUARE_TITLE_LINES = 2;
const SQUARE_PADDING = 10;
const SQUARE_INNER_GAP = 6;
const SQUARE_ICON_MIN = 38;
const SQUARE_ICON_MAX = 76;
const SQUARE_WIDTH_MIN = 112;
const SQUARE_WIDTH_MAX = 168;

// horizontal scroll indicator — its height is ALWAYS reserved (even when the row
// is not scrollable) so that toggling the indicator can never re-trigger layout.
const INDICATOR_HEIGHT = 3;
const INDICATOR_GAP = 10;
const INDICATOR_BLOCK = INDICATOR_HEIGHT + INDICATOR_GAP;

export type HomeLayout = {
  ready: boolean;
  /* circle grid */
  gridWidth: number;
  cellWidth: number;
  cellHeight: number;
  circleSize: number;
  circleIconSize: number;
  circleTitleFont: number;
  circleTitleHeight: number;
  circleTitleLines: number;
  circleTitleGap: number;
  columnGap: number;
  rowGap: number;
  /* square row */
  squareWidth: number;
  squareHeight: number;
  squareIconSize: number;
  squareTitleFont: number;
  squareTitleLines: number;
  squarePadding: number;
  squareGap: number;
  /* chrome */
  horizontalPadding: number;
  sectionGap: number;
  indicatorHeight: number;
  indicatorBlock: number;
};

type Args = { width: number; height: number; textScale: number };

export function useHomeLayout({ width, height, textScale }: Args): HomeLayout {
  return useMemo<HomeLayout>(() => {
    const scale = textScale || 1;

    /* ---- text blocks: fixed, reserved, and font-scale driven ---- */
    const circleTitleFont = clamp(CIRCLE_TITLE_BASE_FONT * scale, 12, 21);
    const circleTitleHeight = lineHeight(circleTitleFont) * CIRCLE_TITLE_LINES;
    const circleTitleBlock = circleTitleHeight + CIRCLE_TITLE_GAP;

    const squareTitleFont = clamp(SQUARE_TITLE_BASE_FONT * scale, 11, 19);
    const squareTitleBlock = lineHeight(squareTitleFont) * SQUARE_TITLE_LINES;

    const squareChrome = SQUARE_PADDING * 2 + squareTitleBlock + SQUARE_INNER_GAP;
    const squareMinHeight = squareChrome + SQUARE_ICON_MIN;

    /* ---- square row: height follows the font size ---- */
    const preferredIcon = clamp(squareTitleFont * 3.6, SQUARE_ICON_MIN, SQUARE_ICON_MAX);
    let squareHeight = Math.round(squareChrome + preferredIcon);

    const gridWidth = Math.max(width - H_PADDING * 2, 0);
    const cellWidth = Math.floor((gridWidth - COL_GAP) / 2);

    // Circle diameter that fits once the square row + indicator have taken their share.
    const circleFor = (sqHeight: number) => {
      const gridHeight = height - (sqHeight + INDICATOR_BLOCK) - SECTION_GAP;
      const cellHeight = (gridHeight - ROW_GAP) / 2;
      return Math.floor(Math.min(cellHeight - circleTitleBlock, cellWidth, CIRCLE_MAX));
    };

    let circleSize = circleFor(squareHeight);

    // Short screens: take height back from the square row before crushing the circles.
    if (height > 0 && circleSize < CIRCLE_MIN) {
      const deficit = (CIRCLE_MIN - circleSize) * 2;
      squareHeight = Math.round(Math.max(squareHeight - deficit, squareMinHeight));
      circleSize = circleFor(squareHeight);
    }
    circleSize = Math.max(circleSize, CIRCLE_MIN);

    const squareIconSize = Math.max(squareHeight - squareChrome, SQUARE_ICON_MIN);
    const squareWidth = Math.round(
      clamp(squareHeight, SQUARE_WIDTH_MIN, SQUARE_WIDTH_MAX),
    );

    return {
      ready: width > 0 && height > 0,

      gridWidth,
      cellWidth,
      cellHeight: circleSize + circleTitleBlock,
      circleSize,
      circleIconSize: circleSize,
      circleTitleFont,
      circleTitleHeight,
      circleTitleLines: CIRCLE_TITLE_LINES,
      circleTitleGap: CIRCLE_TITLE_GAP,
      columnGap: COL_GAP,
      rowGap: ROW_GAP,

      squareWidth,
      squareHeight,
      squareIconSize,
      squareTitleFont,
      squareTitleLines: SQUARE_TITLE_LINES,
      squarePadding: SQUARE_PADDING,
      squareGap: SQUARE_INNER_GAP,

      horizontalPadding: H_PADDING,
      sectionGap: SECTION_GAP,
      indicatorHeight: INDICATOR_HEIGHT,
      indicatorBlock: INDICATOR_BLOCK,
    };
  }, [width, height, textScale]);
}
