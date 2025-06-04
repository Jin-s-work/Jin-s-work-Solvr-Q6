import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SleepList from "./pages/SleepList";
import AddEditSleep from "./pages/AddEditSleep";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-semibold text-gray-800">
            SleepLog
          </Link>
          <Link
            to="/add"
            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Add Record
          </Link>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<SleepList />} />
          <Route path="/add" element={<AddEditSleep />} />
          <Route path="/edit/:id" element={<AddEditSleep />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
