/**
 * Data loading and aggregation.
 * Turns the daily CSV rows into one record per (year, month).
 */

const parseDate = d3.timeParse("%Y-%m-%d");

/**
 * Parse the daily temperature CSV text (see data/temperature-data.js).
 * @param {string} csvText  raw CSV with columns date, max_temperature, min_temperature
 * @returns {Array<{date: Date, max: number, min: number}>}
 */
function parseDailyTemperatures(csvText) {
  return d3.csvParse(csvText.trim(), (row) => ({
    date: parseDate(row.date),
    max: +row.max_temperature,
    min: +row.min_temperature,
  }));
}

/**
 * Group daily records by year and month.
 * Each monthly record keeps the highest daily max, the lowest daily min,
 * and the sorted list of days (needed for the Level 2 line charts).
 */
function aggregateByMonth(dailyRecords) {
  const monthlyRecords = [];
  const recordsByYear = d3.group(
    dailyRecords,
    (day) => day.date.getFullYear(),
    (day) => day.date.getMonth()
  );

  for (const [year, recordsByMonth] of recordsByYear) {
    for (const [month, days] of recordsByMonth) {
      monthlyRecords.push({
        year,
        month,                                   // 0 = January
        max: d3.max(days, (day) => day.max),
        min: d3.min(days, (day) => day.min),
        days: days.slice().sort((a, b) => a.date - b.date),
      });
    }
  }
  return monthlyRecords;
}

/** Keep only the last `yearCount` years present in the data. */
function filterRecentYears(monthlyRecords, yearCount) {
  const latestYear = d3.max(monthlyRecords, (record) => record.year);
  const firstYear = latestYear - yearCount + 1;
  return monthlyRecords.filter((record) => record.year >= firstYear);
}
