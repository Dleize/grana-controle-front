import { useState } from "react";
import { FaBars, FaPen, FaChartBar, FaCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [aberto, setAberto] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: "Apontar Finanças", path: "/finance", icon: <FaPen /> },
    { label: "Relatórios", path: "/reports", icon: <FaChartBar /> },
    { label: "Relatório Geral", path: "/generalreports", icon: <FaChartBar /> },

  ];

  return (
    <aside className={`${aberto ? "w-64" : "w-16"} bg-white shadow-md h-screen transition-all duration-300 p-4`}>
      <div className="flex justify-between items-center mb-6">
        {aberto && <h1 className="text-xl font-bold text-gray-800">Grana Controle</h1>}
        <button onClick={() => setAberto(!aberto)} className="text-gray-600">
          <FaBars />
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-2 py-2 rounded transition-colors ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <span className="text-lg">{icon}</span>
              {aberto && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}