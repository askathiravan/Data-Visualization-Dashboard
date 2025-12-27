import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

/* ---------------- UPLOAD CSV ---------------- */
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await API.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ---------------- GET CHART DATA ---------------- */
export const getChartData = async (xColumn, yColumn) => {
  const response = await API.get("/api/chart-data", {
    params: {
      x: xColumn,
      y: yColumn,
    },
  });

  return response.data;
};
