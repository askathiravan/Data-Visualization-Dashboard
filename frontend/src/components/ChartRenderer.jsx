import { useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function ChartRenderer({ data, chartType, xLabel, yLabel, darkMode }) {
  const chartRef = useRef(null);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  const activeColors = darkMode
    ? ['#8b9cf9', '#9d6ac7', '#ff9ff3', '#6eb9ff']
    : COLORS;

  const handleExport = () => {
    alert('Export feature: install html2canvas to enable');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${xLabel}: ${payload[0].payload.name}`}</p>
          <p className="tooltip-value">{`${yLabel}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  /* ---------------- COMMON AXIS CONFIG ---------------- */
  const commonXAxis = (
    <XAxis
      dataKey="name"
      angle={-30}
      textAnchor="end"
      height={70}
      tickMargin={10}
      stroke={darkMode ? '#fff' : '#333'}
    />
  );

  const commonYAxis = (
    <YAxis
      stroke={darkMode ? '#fff' : '#333'}
      tickMargin={10}
    />
  );

  /* ---------------- BAR CHART ---------------- */
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {commonXAxis}
        {commonYAxis}
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={40} />
        <Bar dataKey="value" fill={activeColors[0]} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  /* ---------------- LINE CHART ---------------- */
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {commonXAxis}
        {commonYAxis}
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={40} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={activeColors[0]}
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  /* ---------------- PIE CHART ---------------- */
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={activeColors[i % activeColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );

  /* ---------------- COMPOSED CHART ---------------- */
  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {commonXAxis}
        {commonYAxis}
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={40} />
        <Bar dataKey="value" fill={activeColors[0]} radius={[6, 6, 0, 0]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={activeColors[1]}
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'composed':
        return renderComposedChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="chart-renderer">
      <div className="chart-header">
        <div>
          <h2>📊 Visualization Result</h2>
          <div className="chart-info">
            <span className="info-badge"><strong>X:</strong> {xLabel}</span>
            <span className="info-badge"><strong>Y:</strong> {yLabel}</span>
            <span className="info-badge"><strong>Type:</strong> {chartType}</span>
          </div>
        </div>
        <button className="export-button" onClick={handleExport}>📥 Export</button>
      </div>

      <div className="chart-container" ref={chartRef}>
        {renderChart()}
      </div>
    </div>
  );
}

export default ChartRenderer;
