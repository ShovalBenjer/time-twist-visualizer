![image](https://github.com/user-attachments/assets/b6febd8d-5506-4dd1-b0b5-a1615c81de9c)

# Time‑Twist Visualizer ⏰🔄

An interactive React + Vite web application for comprehensive time-series analysis—upload data, test for stationarity, configure forecasting models, and visualize results through a modular, responsive UI.

---

## Live Demo

🔗 **Visit the live app:** [time-twist-visualizer.lovable.app](https://time-twist-visualizer.lovable.app/)

## Table of Contents

1. [Core Functionality](#core-functionality)
2. [Frameworks & Libraries](#frameworks--libraries)
3. [Technical Details & Methodology](#technical-details--methodology)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Usage Workflow](#usage-workflow)
7. [Key Components](#key-components)
8. [Developer Notes & Extensibility](#developer-notes--extensibility)
9. [Contribution Guide](#contribution-guide)
10. [License](#license)
11. [Credits](#credits)

---

## Core Functionality

1. **Data Upload & Parsing**

   * Accepts CSV files with timestamp and numeric-value columns.
   * Parses and validates data via `src/lib/utils.ts` (date parsing, missing-value handling).
   * Displays a preview of uploaded data for confirmation.

2. **Stationarity Testing**

   * Implements the **Augmented Dickey–Fuller (ADF)** test to detect unit roots.
   * Outputs test statistic, p-value, and critical values (1%, 5%, 10%).
   * Visualizes rolling mean & variance overlayed on raw data to aid interpretation.
   * Provides suggestions for differencing (first or seasonal) when non-stationary.

3. **Model Selection & Forecasting**

   * Interactive selection of forecasting models: ARIMA, SARIMA, SARIMAX, Exponential Smoothing, Prophet, and AutoARIMA.
   * Customizable parameters (e.g., ARIMA: p, d, q; SARIMA: P, D, Q, s).
   * In-browser computation via WebAssembly (`arima-js`) or optional backend endpoints.
   * Handles exogenous variables and seasonal components as needed.

4. **Prediction Visualization**

   * Renders historical and forecast series with confidence intervals using a reusable `Chart` component.
   * Interactive features: zoom, tooltips, dynamic legends.
   * Displays performance metrics (MSE, MAE, RMSE) and backtest results.

5. **Responsive UI & Navigation**

   * Sidebar-guided workflow: Upload → Stationarity → Model → Prediction.
   * Adapts layout for mobile and desktop using `use-mobile.tsx`.
   * Toast notifications for status updates, errors, and completion via `components/ui/toast`.

---

## Frameworks & Libraries

| Layer             | Tools & Libraries                                | Responsibilities                                     |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **Frontend**      | React 18, TypeScript, Vite                       | Core application structure and build tooling         |
| **Styling**       | Tailwind CSS, PostCSS                            | Utility-first, responsive styling                    |
| **UI Primitives** | shadcn/UI                                        | Accessible components: buttons, dialogs, forms, etc. |
| **Charting**      | Chart.js / D3 (via `chart.tsx`)                  | Interactive time-series plotting                     |
| **Time-Series**   | `arima-js` (WASM), optional Python/Flask backend | ADF testing, ARIMA/SARIMA/SARIMAX forecasting        |
| **Hooks**         | `use-toast.tsx`, `use-mobile.tsx`                | Toast notifications and responsive behavior          |
| **Utilities**     | Papaparse, `src/lib/utils.ts`                    | CSV parsing, data cleaning, date handling            |

---

## Technical Details & Methodology

### Stationarity Testing

* **Augmented Dickey–Fuller (ADF) Test**:

  ```js
  // Example using statsmodels in Python backend
  from statsmodels.tsa.stattools import adfuller
  result = adfuller(series, maxlag=None, regression='c')
  // result: [test_stat, p_value, used_lag, n_obs, critical_values, icbest]
  ```
* Outputs:

  * Test statistic, p-value.
  * Critical values at 1%, 5%, 10%.
* **Visualization**:

  * Rolling statistics computed over a sliding window: mean & variance.
  * Plotted with historical data to visually assess stationarity.

### ARIMA & Advanced Forecasting

* **In-Browser (`arima-js`)**:

  ```ts
  import ARIMA from 'arima';
  const arima = new ARIMA({ p:2, d:1, q:2, P:1, D:1, Q:1, s:12, verbose:false });
  arima.train(timeSeriesArray);
  const [forecast, errors] = arima.predict(horizon);
  ```
* **Features**:

  * **SARIMA**: handles seasonality with seasonal order (P, D, Q, s).
  * **SARIMAX**: incorporates exogenous variables.
  * **AutoARIMA**: automatic selection of optimal (p, d, q).
* **Performance**:

  * Runs asynchronously via Web Workers to prevent UI blocking.
  * Option to offload heavy computation to a Flask/Node backend.

### Python Backend Endpoints (Optional)

* **ADF Test**:

  ```py
  @app.route('/adf-test', methods=['POST'])
  def adf_test():
      data = request.json['series']
      result = adfuller(data, regression='c')
      return jsonify({
          'statistic': result[0],
          'p_value': result[1],
          'critical_values': result[4]
      })
  ```

* **Forecast**:

  ```py
  @app.route('/forecast', methods=['POST'])
  def forecast():
      series = request.json['series']
      order = tuple(request.json['order'])
      model = ARIMA(series, order=order).fit()
      forecast = model.get_forecast(steps=request.json['horizon'])
      return jsonify({
          'predicted_mean': forecast.predicted_mean.tolist(),
          'conf_int': forecast.conf_int().tolist()
      })
  ```

### Charting Pipeline

* **`Chart` Component** in `src/components/ui/chart.tsx`:

  * Wraps Chart.js or D3 for:

    * Time-based axes and formatting.
    * Multiple data series overlay.
    * Shaded confidence interval bands.
    * Interactive tooltips, zoom, and pan.

---

## Project Structure

```
public/
├─ favicon.ico
├─ placeholder.svg
└─ robots.txt

src/
├─ components/
│   ├─ ui/                  ← UI primitives (buttons, dialogs, charts…)
│   ├─ DataUpload.tsx       ← CSV upload & preview
│   ├─ ModelSelection.tsx   ← Model configuration form
│   ├─ Prediction.tsx       ← Forecast submission & chart
│   ├─ StationarityTest.tsx ← ADF test UI & visuals
│   └─ Sidebar.tsx          ← Workflow navigation

├─ hooks/
│   ├─ use-mobile.tsx       ← Detect mobile vs desktop
│   └─ use-toast.tsx        ← Toast notification logic

├─ lib/
│   └─ utils.ts             ← CSV parsing, rolling stats, date helpers

├─ pages/
│   ├─ Index.tsx            ← Main application entry
│   └─ NotFound.tsx         ← 404 fallback

├─ App.tsx                  ← App shell & routing
├─ main.tsx                 ← ReactDOM render
├─ App.css, index.css       ← Global styles
├─ vite-env.d.ts

.gitignore
package.json
vite.config.ts
tsconfig.json

```

---

## Getting Started

### Prerequisites

* Node.js v16+ or Bun
* npm or bun as package manager

### Installation

```bash
# Using npm
git clone https://github.com/ShovalBenjer/time-twist-visualizer.git
cd time-twist-visualizer
npm ci
```

### Development Mode

```bash
npm run dev
```

* Visit [http://localhost:5173](http://localhost:5173) to interact with the app.

### Production Build & Preview

```bash
npm run build
npm run preview
```

---

## Usage Workflow

1. **Upload CSV**:

   * Navigate to *Upload* via the sidebar.
   * Select a CSV with timestamp and numeric columns.
   * Confirm data preview.

2. **Stationarity Test**:

   * Proceed to *Stationarity*.
   * Review ADF results and rolling statistics.
   * If non-stationary, apply differencing in `ModelSelection`.

3. **Configure Model**:

   * Go to *Model*.
   * Choose between ARIMA, SARIMA, SARIMAX, etc.
   * Set hyperparameters or enable AutoARIMA.

4. **Run Forecast**:

   * Move to *Prediction*.
   * Submit configuration; wait for computation toast.
   * View forecast chart with CI bands and metrics.

---

## Key Components

* **DataUpload** (`src/components/DataUpload.tsx`):

  * File input, CSV parsing, data validation previews.

* **StationarityTest** (`src/components/StationarityTest.tsx`):

  * ADF invocation, display of test statistic, p-value, and critical values, plus rolling-mean/variance chart.

* **ModelSelection** (`src/components/ModelSelection.tsx`):

  * Form controls for selecting model type and parameters; validation logic.

* **Prediction** (`src/components/Prediction.tsx`):

  * API or in-browser forecast execution; chart rendering with results.

* **Sidebar** (`src/components/Sidebar.tsx`):

  * Guided navigation through analysis stages.

* **Chart** (`src/components/ui/chart.tsx`):

  * Reusable time-series chart with interactive features.

* **Toast** (`src/components/ui/toast.tsx` & `src/hooks/use-toast.tsx`):

  * Centralized feedback mechanism for operations.

---

## Developer Notes & Extensibility

* **Adding New Tests**:

  * Expand `StationarityTest.tsx`, integrate new statistic functions, update UI accordingly.

* **New Forecasting Models**:

  1. Add UI option in `ModelSelection.tsx`.
  2. Implement computation logic (in JS or backend).
  3. Adapt `Prediction.tsx` to process and chart new output format.

* **Chart Customization**:

  * Modify options in `chart.tsx` for annotations, alternate scales, or theme adjustments.

* **Backend Integration**:

  * Define and document API contracts (e.g., using OpenAPI).
  * Ensure CORS and error handling align with frontend toasts.

---

## Contribution Guide

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes with clear messages.
4. Push to your fork and open a Pull Request.
5. Ensure linting & type checks pass (`npm run lint`).

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Credits

* **Author**: Shoval Benjer.
* Inspired by tools like Facebook’s Prophet, Statsmodels, and interactive charting libraries.

---

For questions, issues, or contributions, feel free to open an issue or discussion on GitHub!

