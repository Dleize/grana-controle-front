import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ReportPage from "./pages/ReportPage";
import TransactionEntryPage from "./pages/TransactionEntryPage";
import { ToastContainer } from "react-toastify";
import ReportGeneralTransaction from "./pages/ReportGeneralTransaction";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/finance" element={<TransactionEntryPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/generalreports" element={<ReportGeneralTransaction />} />
          <Route path="/" element={<Navigate to="/finance" />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
