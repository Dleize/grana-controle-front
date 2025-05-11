export default function ReportSummaryCards({ income, expense, balance }) {
  const format = (val) => "R$ " + (val / 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="Entradas" value={format(income)} color="green" />
      <Card label="Saídas" value={format(expense)} color="red" />
      <Card
        label="Saldo"
        value={format(balance)}
        color={balance >= 0 ? "green" : "red"}
      />
    </div>
  );
}

function Card({ label, value, color }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}
