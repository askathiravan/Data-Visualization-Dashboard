    import { useState, useEffect } from 'react';
    import FileUpload from './components/FileUpload';
    import DataSummary from './components/DataSummary';
    import ChartSelector from './components/ChartSelector';
    import ChartRenderer from './components/ChartRenderer';
    import DataFilter from './components/DataFilter';
    import './App.css';

    function App() {
      const [analysisData, setAnalysisData] = useState(null);
      const [chartData, setChartData] = useState(null);
      const [filteredData, setFilteredData] = useState(null);
      const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '' });
      const [chartType, setChartType] = useState('bar');
      const [error, setError] = useState(null);
      const [darkMode, setDarkMode] = useState(false);
      const [showStats, setShowStats] = useState(true);

      useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
      }, [darkMode]);

      const handleUploadSuccess = (data) => {
        setAnalysisData(data);
        setChartData(null);
        setFilteredData(null);
        setSelectedColumns({ x: '', y: '' });
        setError(null);
      };

      const handleChartDataUpdate = (data) => {
        setChartData(data);
        setFilteredData(data);
        setError(null);
      };

      const handleError = (msg) => {
        setError(msg);
        setTimeout(() => setError(null), 5000);
      };

      const handleFilterData = (filters) => {
        if (!chartData) return;

        let filtered = [...chartData];

        if (filters.minValue) filtered = filtered.filter(d => d.value >= +filters.minValue);
        if (filters.maxValue) filtered = filtered.filter(d => d.value <= +filters.maxValue);
        if (filters.searchTerm)
          filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );

        setFilteredData(filtered);
      };

      return (
        <div className={`app ${darkMode ? 'dark-mode' : ''}`}>

          {/* ---------- HEADER ---------- */}
          <header className="app-header">
            <div className="container header-center">
              <h1>📊 Data Visualization Dashboard</h1>
              <p>Advanced analytics and interactive visualizations</p>

              <div className="header-controls">
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? '☀️' : '🌙'}
                </button>

              </div>
            </div>
          </header>

          {/* ---------- MAIN ---------- */}
          <main className="app-main">
            <div className="container">

              {error && (
                <div className="error-banner">
                  ⚠️ {error}
                </div>
              )}

              <section className="card">
                <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} />
              </section>

              {analysisData && showStats && (
                <section className="card">
                  <DataSummary data={analysisData} />
                </section>
              )}

              {analysisData && (
                <section className="card">
                  <ChartSelector
                    columns={analysisData.columns}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    chartType={chartType}
                    setChartType={setChartType}
                    onChartDataUpdate={handleChartDataUpdate}
                    onError={handleError}
                  />
                </section>
              )}

              {chartData && (
                <section className="card">
                  <DataFilter
                    onFilter={handleFilterData}
                    dataLength={chartData.length}
                    filteredLength={filteredData?.length || 0}
                  />
                </section>
              )}

              {filteredData && (
                <section className="card">
                  <ChartRenderer
                    data={filteredData}
                    chartType={chartType}
                    xLabel={selectedColumns.x}
                    yLabel={selectedColumns.y}
                    darkMode={darkMode}
                  />
                </section>
              )}

            </div>
          </main>

          {analysisData && (
            <button className="fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              ↑
            </button>
          )}
        </div>
      );
    }

    export default App;
