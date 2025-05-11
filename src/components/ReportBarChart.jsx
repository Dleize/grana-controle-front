import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ReportBarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4 text-gray-500">
        <h2 className="text-lg font-semibold mb-2">Movimentações por Dia</h2>
        Nenhum dado disponível.
      </div>
    );
  }

  const formatted = data.map((item) => ({
    ...item,
    day: String(item.day || item.label || "?"), // segurança extra
    income: item.income / 100,
    expense: item.expense / 100,
  }));

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Movimentações por Dia</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="income" fill="#16a34a" name="Entradas" />
          <Bar dataKey="expense" fill="#dc2626" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

