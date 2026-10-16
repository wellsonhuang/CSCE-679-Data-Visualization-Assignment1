/**
 * Reusable chart pieces: color scale, legend and tooltip.
 */

/**
 * Discrete color scale: low temperatures are purple/blue, high are dark red.
 * d3.schemeSpectral goes red → purple, so it is reversed.
 */
function createColorScale() {
  const colors = d3.schemeSpectral[CONFIG.colorStepCount].slice().reverse();
  return d3.scaleQuantize().domain(CONFIG.colorDomain).range(colors);
}

/**
 * Draw a vertical legend of color swatches at (x, y).
 * Coldest color on top, hottest at the bottom.
 */
function drawLegend(svg, colorScale, x, y) {
  const { swatchWidth, swatchHeight, labelOffset } = CONFIG.legend;
  const [topLabel, bottomLabel] = CONFIG.legendLabels;

  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${x}, ${y})`);

  legend.selectAll("rect")
    .data(colorScale.range())
    .join("rect")
    .attr("y", (color, index) => index * swatchHeight)
    .attr("width", swatchWidth)
    .attr("height", swatchHeight)
    .attr("fill", (color) => color);

  // Label at the top edge (coldest) and bottom edge (hottest) of the swatches
  const labelX = swatchWidth + labelOffset;
  const legendHeight = colorScale.range().length * swatchHeight;

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", labelX)
    .attr("y", 0)
    .attr("dy", "0.7em")          // align text top with the first swatch
    .text(topLabel);

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", labelX)
    .attr("y", legendHeight)
    .attr("dy", "0.7em")          // place text just below the last swatch
    .text(bottomLabel);
}

/** Small helper around the shared #tooltip element. */
const tooltip = {
  element: d3.select("#tooltip"),

  show(event, html) {
    this.element
      .html(html)
      .style("left", `${event.pageX + CONFIG.tooltipOffset.x}px`)
      .style("top", `${event.pageY + CONFIG.tooltipOffset.y}px`)
      .style("opacity", 1);
  },

  hide() {
    this.element.style("opacity", 0);
  },
};

/** Text shown when hovering a month cell, e.g. "Date: 2002-03; max: 28 min: 14". */
function formatMonthTooltip(record) {
  const monthNumber = String(record.month + 1).padStart(2, "0");
  return `Date: ${record.year}-${monthNumber}; max: ${record.max} min: ${record.min}`;
}
