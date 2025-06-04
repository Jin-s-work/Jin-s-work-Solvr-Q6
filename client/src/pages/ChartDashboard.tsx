// client/src/pages/ChartDashboard.tsx

import React, { useEffect, useState } from "react";
import { getSleeps } from "../api/sleeps";
import type { SleepRecord } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface DurationData {
  date: string;
  durationMinutes: number;
}

interface WeekdayData {
  weekday: string;
  count: number;
}

const ChartDashboard: React.FC = () => {
  const [durations, setDurations] = useState<DurationData[]>([]);
  const [weekdayCounts, setWeekdayCounts] = useState<WeekdayData[]>([]);

  useEffect(() => {
    async function fetchAndProcess() {
      try {
        const records: SleepRecord[] = await getSleeps();
        // 1) 일별 지속 시간 계산
        const durData: DurationData[] = records.map((r) => {
          // "HH:mm"을 분으로 변환
          const [sh, sm] = r.sleep_start.split(":").map(Number);
          const [eh, em] = r.sleep_end.split(":").map(Number);
          // 예: 시작 23:30, 종료 07:00 → 실제 종료 시각은 다음 날로 간주
          const startMin = sh * 60 + sm;
          const endMin = (eh + (eh < sh ? 24 : 0)) * 60 + em;
          const duration = endMin - startMin;
          return { date: r.date, durationMinutes: duration };
        });
        setDurations(durData);

        // 2) 요일별 카운트 계산
        const weekdayMap: Record<string, number> = {};
        records.forEach((r) => {
          const d = new Date(r.date);
          const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const wd = weekdays[d.getDay()];
          weekdayMap[wd] = (weekdayMap[wd] || 0) + 1;
        });
        const wkData: WeekdayData[] = Object.entries(weekdayMap).map(
          ([weekday, count]) => ({ weekday, count })
        );
        setWeekdayCounts(wkData);
      } catch (err) {
        console.error("차트 데이터 불러오기 실패:", err);
      }
    }

    fetchAndProcess();
  }, []);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">수면 통계 대시보드</h1>

      {/* 1) 일별 수면 지속 시간 라인 차트 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">일별 수면 지속 시간 (분)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={durations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="durationMinutes"
              name="수면 시간(분)"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2) 요일별 수면 횟수 바 차트 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">요일별 수면 기록 횟수</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekdayCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weekday" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="기록 수" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDashboard;
