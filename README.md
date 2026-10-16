# Hong Kong Temperature Heatmap (CSCE 679 Assignment 1)

D3.js (v7) visualization of Hong Kong monthly temperatures, 1997–2017.

- **Level 1** – Year × Month matrix; cell color = monthly max (or min) temperature.
- **Level 2** – Last 10 years; each cell also contains a mini line chart of the
  daily maximum (green) and daily minimum (light blue) temperatures.

Hover a cell to see the date and temperatures. Click any cell (or use the radio
buttons) to switch between maximum and minimum temperature.


## Result

<img width="1134" height="637" alt="Screenshot 2026-10-16 at 5 15 19 PM" src="https://github.com/user-attachments/assets/0cf7aa1a-127b-4834-a32f-6575762c5461" />

<img width="801" height="657" alt="Screenshot 2026-10-16 at 5 15 42 PM" src="https://github.com/user-attachments/assets/688aa042-b211-4957-8cf6-2c41a44415dd" />

## Run

Just double-click `index.html`. No server or internet connection is needed:
D3 is bundled in `lib/`, and the data is embedded in `data/temperature-data.js`.

## Code structure

| File | Purpose |
|------|---------|
| `index.html` | Page layout and containers |
| `style.css` | Styles for cells, lines, legend and tooltip |
| `lib/d3.v7.min.js` | D3.js v7 library (local copy) |
| `data/temperature_daily.csv` | Original dataset |
| `data/temperature-data.js` | Same data embedded as a JS string (lets the page run from `file://`) |
| `js/config.js` | All tunable settings (sizes, colors, number of years) |
| `js/data.js` | Parse CSV, aggregate daily rows into monthly records |
| `js/components.js` | Color scale, legend, tooltip helpers |
| `js/heatmap.js` | Matrix chart shared by Level 1 and Level 2 (+ mini line charts) |
| `js/main.js` | Entry point: loads data, draws charts, handles max/min switch |






