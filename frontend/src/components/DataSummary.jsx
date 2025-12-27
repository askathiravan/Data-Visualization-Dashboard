function DataSummary({ summary }) {
  if (!summary) return null;

  return (
    <div>
      <h3>Dataset Summary</h3>
      <p><b>Rows:</b> {summary.row_count}</p>

      <h4>Columns</h4>
      <ul>
        {summary.columns.map((col) => (
          <li key={col}>{col}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataSummary;
