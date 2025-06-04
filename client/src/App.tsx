// client/src/App.tsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SleepList from "./pages/SleepList";
import AddEditSleep from "./pages/AddEditSleep";
import ChartDashboard from "./pages/ChartDashboard"; // ★ 추가
import SleepAdvice from "./pages/SleepAdvice"; // ★ 추가

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-semibold text-gray-800">
            SleepLog
          </Link>
          <div className="space-x-3">
            <Link
              to="/add"
              className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
            >
              Add Record
            </Link>
            <Link
              to="/charts"
              className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
            >
              View Charts
            </Link>
            <Link
              to="/advice"
              className="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-600"
            >
              AI Advice
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<SleepList />} />
          <Route path="/add" element={<AddEditSleep />} />
          <Route path="/edit/:id" element={<AddEditSleep />} />
          <Route path="/charts" element={<ChartDashboard />} /> {/* ★ 추가 */}
          <Route path="/advice" element={<SleepAdvice />} /> {/* ★ 추가 */}
        </Routes>
      </main>
    </div>
  );
};

export default App;
