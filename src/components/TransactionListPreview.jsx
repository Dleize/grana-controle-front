export default function TransactionListPreview({ entries, onEdit, onRemove, onConfirm }) {
  if (entries.length === 0) {
    return <p className="text-gray-500">Nenhuma transação na lista.</p>;
  }

  console.log(entries);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Pré-visualização</h2>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Descrição</th>
            <th className="py-2">Categoria</th>
            <th className="py-2">Tipo</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Data</th>
            <th className="py-2">Recorrente</th>
            <th className="py-2">Observação</th>
            <th className="py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b align-top">
              <td className="py-2">{entry.description.value}</td>
              <td className="py-2">{entry.category.value}</td>
              <td className={`py-2 ${entry.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {entry.type === "income" ? "Entrada" : "Saída"}
              </td>
              <td className="py-2">R$ {(entry.value / 100).toFixed(2)}</td>
              <td className="py-2">{entry.date}</td>
              <td className="py-2 text-center">{entry.isRecurring ? "Sim" : "—"}</td>
              <td className="py-2 italic text-gray-600">{entry.notes || "—"}</td>
              <td className="py-2">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(entry)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => onRemove(entry.id)} className="text-red-600 hover:underline">Remover</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Confirmar apontamentos
        </button>
      </div>
    </div>
  );
}
