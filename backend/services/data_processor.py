import pandas as pd
from typing import Dict, List, Any


class DataProcessor:

    def analyze_csv(self, file_path: str) -> Dict[str, Any]:
        df = pd.read_csv(file_path)

        if df.empty:
            raise ValueError("CSV file is empty")

        return {
            "columns": df.columns.tolist(),
            "row_count": len(df),
            "sample_data": df.head(5).to_dict("records"),
            "statistics": df.describe(include="all").fillna("").to_dict(),
            "data_types": df.dtypes.astype(str).to_dict()
        }

    def get_chart_data(
        self,
        file_path: str,
        x_column: str,
        y_column: str
    ) -> List[Dict[str, Any]]:

        df = pd.read_csv(file_path)

        if x_column not in df.columns or y_column not in df.columns:
            raise ValueError("Invalid column selection")

        chart_df = df[[x_column, y_column]].dropna()

        chart_df[x_column] = chart_df[x_column].astype(str)
        chart_df[y_column] = pd.to_numeric(chart_df[y_column], errors="coerce")

        chart_df = chart_df.dropna()

        return chart_df.rename(
            columns={x_column: "name", y_column: "value"}
        ).to_dict("records")
