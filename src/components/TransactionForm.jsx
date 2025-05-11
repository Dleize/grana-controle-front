// TransactionForm.jsx
import { useState, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import api from "../services/api";

export default function TransactionForm({ onSubmit, onCancel, initialData = null, suggestions }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.descriptionLabel || "");
      setCategory(initialData.categoryLabel || "");
      setType(initialData.type || "income");
      setValue(
        initialData.value
          ? (initialData.value / 100).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : ""
      );
      setDate(initialData.date || "");
      setNotes(initialData.notes || "");
      setIsRecurring(initialData.isRecurring || false);
    }
  }, [initialData]);

  const reset = () => {
    setDescription("");
    setCategory("");
    setType("income");
    setValue("");
    setDate("");
    setNotes("");
    setIsRecurring(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !category || !value || !date) return;

    const parsedValue = Math.round(
      parseFloat(value.replace(/\./g, "").replace(",", ".")) * 100
    );

    let desc = suggestions.descriptions.find((d) => d.value === description);
    let cat = suggestions.categories.find((c) => c.value === category);

    if (!desc) {
      const res = await api.post("/description-suggestions", { value: description });
      desc = res.data;
    }
    if (!cat) {
      const res = await api.post("/category-suggestions", { value: category });
      cat = res.data;
    }

    onSubmit({
      id: initialData?.id,
      description: { 'id': desc.id, 'value': desc.value },
      category:{ 'id': cat.id, 'value': cat.value },
      type,
      value: parsedValue,
      date,
      notes,
      isRecurring,
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">{initialData ? "Editar Transação" : "Nova Transação"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AutocompleteInput
          placeholder="Descrição"
          value={description}
          onChange={setDescription}
          options={suggestions.descriptions.map((d) => d.value)}
        />
        <AutocompleteInput
          placeholder="Categoria"
          value={category}
          onChange={setCategory}
          options={suggestions.categories.map((c) => c.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded w-full">
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
        <input
          type="text"
          placeholder="Valor"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const number = Number(raw || "0");
            const formatted = (number / 100).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            setValue(formatted);
          }}
          className="p-2 border rounded w-full"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded w-full" />
        <input type="text" placeholder="Observação" value={notes} onChange={(e) => setNotes(e.target.value)} className="p-2 border rounded w-full" />
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-5 h-5" />
          <label>É recorrente?</label>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancelar edição
          </button>
        )}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {initialData ? "Atualizar" : "Adicionar à lista"}
        </button>
      </div>
    </form>
  );
}
