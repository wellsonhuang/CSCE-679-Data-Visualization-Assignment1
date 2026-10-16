/**
 * All tunable settings live here, so the look of the charts can be
 * changed without touching the drawing code.
 */
const CONFIG = {
  // Temperatures are split into 11 discrete color steps.
  // The domain [0, 39] reproduces the bins in the reference image
  // (e.g. 25 °C → orange, 31 °C → orange-red, 32 °C → red, 36 °C → dark red).
  colorDomain: [0, 39],
  colorStepCount: 11,
  legendLabels: ["0 Celsius", "40 Celsius"],   // top and bottom of the legend

  // Legend: size of each color swatch and gap between the matrix and the legend
  legend: { swatchWidth: 22, swatchHeight: 22, gapFromChart: 20, labelOffset: 4 },

  // Tooltip position relative to the mouse pointer (px)
  tooltipOffset: { x: 12, y: -28 },

  // Duration (ms) of the color transition when switching max/min
  transitionDuration: 400,

  // Day-of-month range used for the x axis of the mini line charts
  dayOfMonthRange: [1, 31],

  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],

  // Level 1: every year in the dataset, plain colored cells
  level1: {
    cellWidth: 41,
    cellHeight: 37,
    cellPadding: 0.15,          // fraction of the cell left as a gap
    margin: { top: 30, right: 110, bottom: 20, left: 80 },
    showDailyLines: false,
  },

  // Level 2: only the most recent years, cells contain mini line charts
  level2: {
    recentYearCount: 10,
    cellWidth: 97,
    cellHeight: 72,
    cellPadding: 0.2,
    margin: { top: 30, right: 110, bottom: 20, left: 80 },
    showDailyLines: true,
    lineColors: { max: "#31a354", min: "#a6bddb" },
    lineInset: 4,               // inner padding (px) between cell edge and line chart
  },
};
