import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AutocompleteInput from "../components/AutocompleteInput";

export default function ReportGeneralTransaction() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [suggestions, setSuggestions] = useState({ descriptions: [], categories: [] });

  useEffect(() => {
    const fetchSuggestions = async () => {
      const descRes = await api.get("/description-suggestions");
      const catRes = await api.get("/category-suggestions");
      setSuggestions({
        descriptions: descRes.data.map((d) => d.value),
        categories: catRes.data.map((c) => c.value),
      });
    };
    fetchSuggestions();
  }, []);

  const fetchTransactions = async () => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 31) {
      setError("O intervalo máximo permitido é de 31 dias.");
      setTransactions([]);
      return;
    }

    try {
      const { data } = await api.get("/transactions", { params: { start, end } });
      setTransactions(data);
      setError("");
    } catch (err) {
      setError("Erro ao buscar transações.");
    }
  };

  const handleEdit = (t) => {
    setEditRowId(t.id);
    setEditRowData({
      ...t,
      description: typeof t.description === "object" ? t.description.value : t.description,
      category: typeof t.category === "object" ? t.category.value : t.category,
      value: (t.value / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  const handleSave = async () => {
    try {
      const desc = await api.post("/description-suggestions", { value: editRowData.description });
      const cat = await api.post("/category-suggestions", { value: editRowData.category });

      const parsedValue = Math.round(
        parseFloat(editRowData.value.replace(/\./g, "").replace(",", ".")) * 100
      );

      await api.put(`/transactions/${editRowId}`, {
        descriptionId: desc.data.id,
        categoryId: cat.data.id,
        type: editRowData.type,
        value: parsedValue,
        date: editRowData.date,
        notes: editRowData.notes,
        isRecurring: editRowData.isRecurring,
        month: new Date(editRowData.date).getMonth() + 1,
        year: new Date(editRowData.date).getFullYear(),
      });

      toast.success("Transação atualizada com sucesso!");
      setTransactions((prev) =>
        prev.map((t) => (t.id === editRowId ? { ...t, ...editRowData, value: parsedValue } : t))
      );
      handleCancel();
    } catch (err) {
      toast.error("Erro ao salvar alteração.");
    }
  };

  const handleChange = (field, value) => {
    setEditRowData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transação removida com sucesso!");
      setDeleteRowId(null);
    } catch {
      toast.error("Erro ao remover transação.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Relatório Geral</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Data Inicial</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Data Final</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <button onClick={fetchTransactions} className="h-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Buscar
        </button>
      </div>

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm mt-6">
            <thead>
              <tr className="bg-gray-100 border-b text-left text-gray-700">
                <th className="py-3 px-2">Descrição</th>
                <th className="py-3 px-2">Categoria</th>
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Valor</th>
                <th className="py-3 px-2">Data</th>
                <th className="py-3 px-2">Recorrente</th>
                <th className="py-3 px-2">Observação</th>
                <th className="py-3 px-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <AutocompleteInput value={editRowData.description} onChange={(val) => handleChange("description", val)} options={suggestions.descriptions} placeholder="Descrição" />
                    ) : (
                      typeof t.description === "object" ? t.description.value : t.description
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <AutocompleteInput value={editRowData.category} onChange={(val) => handleChange("category", val)} options={suggestions.categories} placeholder="Categoria" />
                    ) : (
                      typeof t.category === "object" ? t.category.value : t.category
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <select value={editRowData.type} onChange={(e) => handleChange("type", e.target.value)} className="border p-1 rounded w-full">
                        <option value="income">Entrada</option>
                        <option value="expense">Saída</option>
                      </select>
                    ) : (
                      <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>{t.type === "income" ? "Entrada" : "Saída"}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <input
                        type="text"
                        value={editRowData.value || ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const number = Number(raw || "0");
                          const formatted = (number / 100).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                          handleChange("value", formatted);
                        }}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      `R$ ${(t.value / 100).toFixed(2)}`
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <input type="date" value={editRowData.date || ""} onChange={(e) => handleChange("date", e.target.value)} className="border p-1 rounded w-full" />
                    ) : (
                      t.date
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {editRowId === t.id ? (
                      <input type="checkbox" checked={editRowData.isRecurring || false} onChange={(e) => handleChange("isRecurring", e.target.checked)} />
                    ) : (
                      t.isRecurring ? "Sim" : "—"
                    )}
                  </td>
                  <td className="py-2 px-2 italic text-gray-600">
                    {editRowId === t.id ? (
                      <input value={editRowData.notes || ""} onChange={(e) => handleChange("notes", e.target.value)} className="border p-1 rounded w-full" />
                    ) : (
                      t.notes || "—"
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editRowId === t.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="text-green-600 hover:underline">Salvar</button>
                        <button onClick={handleCancel} className="text-gray-500 hover:underline">Cancelar</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Editar</button>
                        <button onClick={() => setDeleteRowId(t.id)} className="text-red-600 hover:underline">Remover</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {deleteRowId && (
                <tr className="bg-red-50 border-b">
                  <td colSpan="8" className="py-2 text-center">
                    <span className="text-red-600">Deseja remover esta transação?</span>
                    <button onClick={() => handleDelete(deleteRowId)} className="ml-4 text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700">Confirmar</button>
                    <button onClick={() => setDeleteRowId(null)} className="ml-2 text-sm text-gray-600 hover:underline">Cancelar</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
