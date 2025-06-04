// client/src/pages/SleepAdvice.tsx
import React, { useState } from "react";

const SleepAdvice: React.FC = () => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    setAdvice("");

    try {
      const res = await fetch("/api/sleeps/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days: 7 }),
      });

      if (!res.ok) throw new Error("서버 응답 실패");

      const json = await res.json();
      setAdvice(json.advice || "조언이 없습니다.");
    } catch (err) {
      console.error(err);
      setAdvice("❌ AI 조언을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">AI 수면 조언</h2>
      <p className="mb-4 text-gray-600">
        최근 7일간의 수면 기록을 바탕으로 AI가 맞춤형 조언을 드립니다.
      </p>
      <button
        onClick={fetchAdvice}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {loading ? "분석 중..." : "AI 조언 받기"}
      </button>
      {advice && (
        <div className="mt-6 whitespace-pre-wrap text-gray-800 border rounded-md p-4 bg-gray-50">
          {advice}
        </div>
      )}
    </div>
  );
};

export default SleepAdvice;
