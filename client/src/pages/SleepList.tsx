import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSleeps, deleteSleep } from "../api/sleeps";
import type { SleepRecord } from "../types";

const SleepList: React.FC = () => {
  const [sleeps, setSleeps] = useState<SleepRecord[]>([]);
  const navigate = useNavigate();

  const fetchSleeps = async () => {
    try {
      const data = await getSleeps();
      setSleeps(data);
    } catch (err) {
      console.error("수면 기록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchSleeps();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("이 기록을 정말 삭제하시겠습니까?")) {
      try {
        await deleteSleep(id);
        fetchSleeps();
      } catch (err) {
        console.error("삭제 실패:", err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">수면 기록 목록</h1>
      {sleeps.length === 0 ? (
        <p className="text-gray-600">아직 등록된 기록이 없습니다. 먼저 기록을 추가해보세요!</p>
      ) : (
        <div className="space-y-4">
          {sleeps.map((record) => (
            <div
              key={record.id}
              className="bg-white p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{record.date}</p>
                <p className="text-gray-600">
                  {record.sleepStart} → {record.sleepEnd}
                </p>
                {record.note && (
                  <p className="mt-1 text-gray-500">특이사항: {record.note}</p>
                )}
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => navigate(`/edit/${record.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SleepList;
