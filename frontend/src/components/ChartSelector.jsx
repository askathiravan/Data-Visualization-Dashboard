import { useState } from 'react';
import { getChartData } from '../services/api';

function ChartSelector({
  columns,
  selectedColumns,
  setSelectedColumns,
  chartType,
  setChartType,
  onChartDataUpdate,
  onError
}) {
  const [loading, setLoading] = useState(false);

  // Available chart types with icons and descriptions
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: '📊', description: 'Compare categories' },
    { value: 'line', label: 'Line Chart', icon: '📈', description: 'Show trends over time' },
    { value: 'pie', label: 'Pie Chart', icon: '🥧', description: 'Show proportions' },
    { value: 'composed', label: 'Combo Chart', icon: '📊📈', description: 'Bar + Line' }
  ];

  const handleColumnChange = (axis, value) => {
    setSelectedColumns(prev => ({
      ...prev,
      [axis]: value
    }));
  };

  const handleGenerateChart = async () => {
    if (!selectedColumns.x || !selectedColumns.y) {
      onError('Please select both X and Y columns');
      return;
    }

    if (selectedColumns.x === selectedColumns.y) {
      onError('X and Y columns must be different');
      return;
    }

    setLoading(true);

    try {
      const data = await getChartData(selectedColumns.x, selectedColumns.y);
      onChartDataUpdate(data);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chart-selector">
      <div className="section-header">
        <h2>📐 Configure Visualization</h2>
        <p className="section-subtitle">Select columns and chart type</p>
      </div>
      
      {/* Column Selectors */}
      <div className="selector-grid">
        <div className="control-group">
          <label htmlFor="x-column">
            <span className="label-icon">📍</span>
            X-Axis Column
          </label>
          <select
            id="x-column"
            value={selectedColumns.x}
            onChange={(e) => handleColumnChange('x', e.target.value)}
            disabled={loading}
            className="select-modern"
          >
            <option value="">Choose column...</option>
            {columns.map((col, index) => (
              <option key={index} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="y-column">
            <span className="label-icon">📏</span>
            Y-Axis Column
          </label>
          <select
            id="y-column"
            value={selectedColumns.y}
            onChange={(e) => handleColumnChange('y', e.target.value)}
            disabled={loading}
            className="select-modern"
          >
            <option value="">Choose column...</option>
            {columns.map((col, index) => (
              <option key={index} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Type Selector - Card Grid */}
      <div className="chart-type-section">
        <h3>Select Chart Type</h3>
        <div className="chart-type-grid">
          {chartTypes.map(type => (
            <div
              key={type.value}
              className={`chart-type-card ${chartType === type.value ? 'active' : ''}`}
              onClick={() => setChartType(type.value)}
            >
              <div className="chart-type-icon">{type.icon}</div>
              <div className="chart-type-label">{type.label}</div>
              <div className="chart-type-desc">{type.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateChart}
        disabled={!selectedColumns.x || !selectedColumns.y || loading}
        className={`generate-button ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          <>
            <span>✨</span>
            Generate Visualization
          </>
        )}
      </button>
    </div>
  );
}

export default ChartSelector;