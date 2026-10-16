/**
 * Entry point: load data, draw both charts, and wire up the max/min switch.
 */

function main() {
  const dailyRecords = parseDailyTemperatures(TEMPERATURE_CSV);
  const monthlyRecords = aggregateByMonth(dailyRecords);
  const recentMonthlyRecords = filterRecentYears(monthlyRecords, CONFIG.level2.recentYearCount);

  let currentMode = "max";   // which temperature colors the cells: "max" or "min"
  const charts = [];

  // Apply a mode to every chart and keep the radio buttons in sync
  function setMode(mode) {
    currentMode = mode;
    charts.forEach((chart) => chart.setMode(mode));
    d3.select(`input[name="mode"][value="${mode}"]`).property("checked", true);
  }

  const toggleMode = () => setMode(currentMode === "max" ? "min" : "max");

  charts.push(
    drawTemperatureMatrix("#level1-chart", monthlyRecords, CONFIG.level1, { onCellClick: toggleMode }),
    drawTemperatureMatrix("#level2-chart", recentMonthlyRecords, CONFIG.level2, { onCellClick: toggleMode })
  );

  d3.selectAll('input[name="mode"]').on("change", (event) => setMode(event.target.value));

  setMode(currentMode);
}

main();
