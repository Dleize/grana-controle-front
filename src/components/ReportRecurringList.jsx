export default function ReportRecurringList({ data }) {
  const toReal = (val) =>
    (val / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4 text-gray-500">
        <h2 className="text-lg font-semibold mb-2">Gastos Recorrentes</h2>
        Nenhum gasto recorrente encontrado.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Gastos Recorrentes</h2>
      <ul className="divide-y divide-gray-200 text-sm">
        {data.map((t) => (
          <li
            key={t.id}
            className="py-2 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="font-medium text-gray-800">
              {t.description?.value || "Sem descrição"}
              <span className="ml-2 text-gray-500">
                ({t.category?.value || "Sem categoria"})
              </span>
            </div>
            <div className="flex gap-4 mt-1 md:mt-0 text-sm text-gray-600">
              <span>{toReal(t.value)}</span>
              <span>
                {t.date
                  ? new Date(t.date).toLocaleDateString("pt-BR")
                  : "Data inválida"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
