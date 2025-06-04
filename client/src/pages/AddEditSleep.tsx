import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSleep, getSleep, updateSleep } from "../api/sleeps";

const AddEditSleep: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [sleepStart, setSleepStart] = useState<string>("");
  const [sleepEnd, setSleepEnd] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (id) {
      getSleep(Number(id))
        .then((data) => {
          setDate(data.date);
          setSleepStart(data.sleepStart);
          setSleepEnd(data.sleepEnd);
          setNote(data.note);
        })
        .catch((err) => {
          console.error("기록 불러오기 실패:", err);
          alert("해당 기록을 불러오는 데 실패했습니다.");
        });
    } else {
      // 등록 모드: 기본 날짜를 오늘로 설정
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !sleepStart || !sleepEnd) {
      alert("날짜와 수면 시작/종료 시간은 필수입니다.");
      return;
    }

    try {
      const payload = {
        date,
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
        note: note || ""
      };

      if (id) {
        // 수정
        await updateSleep(Number(id), payload);
      } else {
        // 생성
        await createSleep(payload);
      }
      navigate("/");
    } catch (err) {
      console.error("서버와 통신 중 오류:", err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">
        {id ? "기록 수정" : "기록 추가"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">수면 시작</label>
          <input
            type="time"
            value={sleepStart}
            onChange={(e) => setSleepStart(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">수면 종료</label>
          <input
            type="time"
            value={sleepEnd}
            onChange={(e) => setSleepEnd(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">특이사항 (선택)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            rows={3}
            placeholder="간단한 메모를 남겨보세요."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {id ? "수정 완료" : "기록 완료"}
        </button>
      </form>
    </div>
  );
};

export default AddEditSleep;
