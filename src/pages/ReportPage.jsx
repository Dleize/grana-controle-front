import { useState, useEffect } from "react";
import api from "../services/api";
import ReportSummaryCards from "../components/ReportSummaryCards";
import ReportBarChart from "../components/ReportBarChart";
import ReportPieChart from "../components/ReportPieChart";
import ReportRecurringList from "../components/ReportRecurringList";
import ReportGeneralTransaction from "./ReportGeneralTransaction";

export default function ReportDashboard() {
  const [mode, setMode] = useState("monthly"); // 'monthly', 'yearly', 'custom'
  const [report, setReport] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetchReport();
  }, [mode]);

  const fetchReport = async () => {
    let res;

    if (mode === "monthly") {
      res = await api.get("/report", { params: { month, year } });
    } else if (mode === "yearly") {
      res = await api.get("/report", { params: { year } });
    } else if (mode === "custom" && start && end) {
      res = await api.get("/report", { params: { start, end } });
    }

    setReport(res?.data || null);
  };

  const toReal = (val) =>
    (val / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>

      {/* Seletor de modo */}
      <div className="flex gap-4">
        {["monthly", "yearly", "custom"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded ${
              mode === m ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {m === "monthly"
              ? "Mensal"
              : m === "yearly"
              ? "Anual"
              : "Personalizado"}
          </button>
        ))}
      </div>

      {/* Filtros */}
      {(mode === "monthly" || mode === "yearly") && (
        <div className="flex gap-4 items-center">
          {mode === "monthly" && (
            <select
              value={month}
              onChange={(e) => setMonth(+e.target.value)}
              className="p-2 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      )}

      {mode === "custom" && (
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600">Data Inicial</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Data Final</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      )}

      {/* Relatórios */}
      {report && (
        <>
          <ReportSummaryCards
            income={report.totalIncome}
            expense={report.totalExpense}
            balance={report.currentBalance}
          />

          <ReportBarChart data={report.movementsByPeriod} />

          <ReportPieChart data={report.byCategory?.expense || []} />

          <ReportRecurringList data={report.recurringExpenses || []} />
        </>
      )}
    </div>
  );
}
