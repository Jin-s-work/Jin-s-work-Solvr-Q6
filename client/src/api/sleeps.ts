import axios from "axios";
import type { SleepRecord } from "../types";

const api = axios.create({
  baseURL: "/api" // Vite proxy 설정 덕분에 /api → http://localhost:8000/api 로 연결됩니다.
});

// 모든 기록 조회
export const getSleeps = async (): Promise<SleepRecord[]> => {
  const res = await api.get<SleepRecord[]>("/sleeps");
  return res.data;
};

// 단일 기록 조회
export const getSleep = async (id: number): Promise<SleepRecord> => {
  const res = await api.get<SleepRecord>(`/sleeps/${id}`);
  return res.data;
};

// 새로운 기록 생성
export const createSleep = async (data: {
  date: string;
  sleep_start: string;
  sleep_end: string;
  note: string;
}): Promise<SleepRecord> => {
  const res = await api.post<SleepRecord>("/sleeps", data);
  return res.data;
};

// 기존 기록 수정
export const updateSleep = async (
  id: number,
  data: {
    date: string;
    sleep_start: string;
    sleep_end: string;
    note: string;
  }
): Promise<SleepRecord> => {
  const res = await api.put<SleepRecord>(`/sleeps/${id}`, data);
  return res.data;
};

// 기록 삭제
export const deleteSleep = async (id: number): Promise<void> => {
  await api.delete(`/sleeps/${id}`);
};
