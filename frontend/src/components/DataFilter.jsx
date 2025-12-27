import { useState } from 'react';

function DataFilter({ onFilter, dataLength, filteredLength }) {
  const [filters, setFilters] = useState({
    minValue: '',
    maxValue: '',
    searchTerm: ''
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { minValue: '', maxValue: '', searchTerm: '' };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="data-filter">
      <div className="filter-header">
        <h3>🔍 Filter Data</h3>
        <span className="filter-count">
          Showing {filteredLength} of {dataLength} records
        </span>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Search by Name</label>
          <input
            type="text"
            placeholder="Type to search..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Min Value</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minValue}
            onChange={(e) => handleFilterChange('minValue', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Max Value</label>
          <input
            type="number"
            placeholder="∞"
            value={filters.maxValue}
            onChange={(e) => handleFilterChange('maxValue', e.target.value)}
            className="filter-input"
          />
        </div>

        <button className="reset-button" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default DataFilter;