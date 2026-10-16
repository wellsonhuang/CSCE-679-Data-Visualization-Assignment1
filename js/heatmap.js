/**
 * The Year / Month matrix chart, used by both Level 1 and Level 2.
 * Level 2 simply turns on `showDailyLines` to add mini line charts.
 */

/**
 * Draw a temperature matrix inside `containerSelector`.
 *
 * @param {string} containerSelector  CSS selector of the container div
 * @param {Array}  monthlyRecords     output of aggregateByMonth()
 * @param {object} layout             CONFIG.level1 or CONFIG.level2
 * @param {object} callbacks          { onCellClick } – called when a cell is clicked
 * @returns {{ setMode: (mode: "max"|"min") => void }}
 */
function drawTemperatureMatrix(containerSelector, monthlyRecords, layout, callbacks = {}) {
  const { margin, cellWidth, cellHeight } = layout;

  // ----- Scales -----------------------------------------------------------
  const years = Array.from(new Set(monthlyRecords.map((r) => r.year))).sort();
  const months = d3.range(CONFIG.monthNames.length);   // 0 (Jan) … 11 (Dec)

  const xScale = d3.scaleBand()           // one column per year
    .domain(years)
    .range([0, years.length * cellWidth])
    .padding(layout.cellPadding);

  const yScale = d3.scaleBand()           // one row per month
    .domain(months)
    .range([0, months.length * cellHeight])
    .padding(layout.cellPadding);

  const colorScale = createColorScale();

  // ----- SVG canvas -------------------------------------------------------
  const innerWidth = xScale.range()[1];
  const innerHeight = yScale.range()[1];

  const svg = d3.select(containerSelector)
    .append("svg")
    .attr("width", innerWidth + margin.left + margin.right)
    .attr("height", innerHeight + margin.top + margin.bottom);

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ----- Axes -------------------------------------------------------------
  chart.append("g")
    .attr("class", "axis")
    .call(d3.axisTop(xScale).tickFormat(d3.format("d")));

  chart.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale).tickFormat((month) => CONFIG.monthNames[month]));

  // ----- Cells (one <g> per month) ----------------------------------------
  const cells = chart.selectAll(".month-group")
    .data(monthlyRecords)
    .join("g")
    .attr("class", "month-group")
    .attr("transform", (r) => `translate(${xScale(r.year)}, ${yScale(r.month)})`);

  const cellRects = cells.append("rect")
    .attr("class", "month-cell")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .on("mousemove", (event, record) => tooltip.show(event, formatMonthTooltip(record)))
    .on("mouseleave", () => tooltip.hide())
    .on("click", () => callbacks.onCellClick?.());

  if (layout.showDailyLines) {
    drawDailyLines(cells, monthlyRecords, xScale.bandwidth(), yScale.bandwidth(), layout);
  }

  // ----- Legend -----------------------------------------------------------
  drawLegend(svg, colorScale, margin.left + innerWidth + CONFIG.legend.gapFromChart, margin.top);

  // ----- Public API: recolor cells for "max" or "min" ---------------------
  function setMode(mode) {
    cellRects.transition()
      .duration(CONFIG.transitionDuration)
      .attr("fill", (record) => colorScale(record[mode]));
  }

  return { setMode };
}

/**
 * Add a mini line chart (daily max + daily min) inside every cell.
 * All cells share the same y scale so the lines are comparable.
 */
function drawDailyLines(cells, monthlyRecords, cellWidth, cellHeight, layout) {
  const inset = layout.lineInset;
  const allDays = monthlyRecords.flatMap((record) => record.days);

  const dayScale = d3.scaleLinear()                 // day of month → x
    .domain(CONFIG.dayOfMonthRange)
    .range([inset, cellWidth - inset]);

  const temperatureScale = d3.scaleLinear()          // temperature → y
    .domain([d3.min(allDays, (d) => d.min), d3.max(allDays, (d) => d.max)])
    .range([cellHeight - inset, inset]);

  // Build a line generator for either the "max" or "min" field
  const lineFor = (field) => d3.line()
    .x((day) => dayScale(day.date.getDate()))
    .y((day) => temperatureScale(day[field]));

  for (const field of ["max", "min"]) {
    cells.append("path")
      .attr("class", `daily-line daily-line-${field}`)
      .attr("stroke", layout.lineColors[field])
      .attr("d", (record) => lineFor(field)(record.days));
  }
}
