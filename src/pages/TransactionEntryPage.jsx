// TransactionEntryPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionListPreview from "../components/TransactionListPreview";
import ReportSummaryCards from "../components/ReportSummaryCards";

const STORAGE_KEY = "pending_transactions";

export default function TransactionEntryPage() {
  const [pending, setPending] = useState([]);
  const [editing, setEditing] = useState(null);
  const [balance, setBalance] = useState(null);
  const [suggestions, setSuggestions] = useState({ descriptions: [], categories: [] });

  useEffect(() => {
    fetchBalance();
    fetchSuggestions();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPending(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  }, [pending]);

  const fetchBalance = async () => {
    const { data } = await api.get("/balance");
    setBalance(data);
  };

  const fetchSuggestions = async () => {
    const descRes = await api.get("/description-suggestions");
    const catRes = await api.get("/category-suggestions");
    setSuggestions({
      descriptions: descRes.data,
      categories: catRes.data,
    });
  };

  const handleAddOrEdit = (entry) => {
    setPending((prev) => {
      const filtered = prev.filter((e) => e.id !== entry.id);
      return [...filtered, { ...entry, id: entry.id || crypto.randomUUID() }];
    });
    setEditing(null);
  };

  const handleEdit = (entry) => {
    setEditing(entry);
    handleRemove(entry.id);
  };

  const handleCancelEdit = () => {
    if (editing) {
      setPending((prev) => [...prev, { ...editing, id: editing.id || crypto.randomUUID() }]);
      setEditing(null);
    }
  };

  const handleRemove = (id) => {
    setPending((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConfirmAll = async () => {
    await Promise.all(
      pending.map((entry) =>
        api.post("/transactions", {
          descriptionId: entry.description.id,
          categoryId: entry.category.id,
          type: entry.type,
          value: entry.value,
          date: entry.date,
          notes: entry.notes,
          isRecurring: entry.isRecurring,
          month: entry.month,
          year: entry.year,
        })
      )
    );
    setPending([]);
    localStorage.removeItem(STORAGE_KEY);
    fetchBalance();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Apontar Finanças</h1>

      {balance && (
        <ReportSummaryCards
          income={balance.totalIncome}
          expense={balance.totalExpense}
          balance={balance.currentBalance}
        />
      )}

      <TransactionForm
        key={editing?.id || "new"}
        onSubmit={handleAddOrEdit}
        onCancel={handleCancelEdit}
        initialData={editing}
        suggestions={suggestions}
      />

      <TransactionListPreview
        entries={pending}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onConfirm={handleConfirmAll}
      />
    </div>
  );
}
