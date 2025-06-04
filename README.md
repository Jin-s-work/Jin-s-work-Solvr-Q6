# 풀스택 서비스 보일러 플레이트

## 프로젝트 개요

이 보일러 플레이트는 풀스택 웹 애플리케이션 개발을 위한 기본 구조를 제공합니다. monorepo 구조로 클라이언트와 서버를 효율적으로 관리하며, 현대적인 웹 개발 기술 스택을 활용합니다.

## 기술 스택

### 공통

- 패키지 매니저: pnpm (workspace 기능 활용)
- 언어: TypeScript
- Node.js 버전: 22.x
- 테스트: Vitest
- 코드 품질: Prettier

### 클라이언트

- 프레임워크: React
- 빌드 도구: Vite
- 라우팅: React Router
- 스타일링: TailwindCSS

### 서버

- 프레임워크: Fastify
- 데이터베이스: SQLite with DirzzleORM

## 설치 및 실행

### 초기 설치

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm install
```

### 개발 서버 실행

```bash
# 클라이언트 및 서버 동시 실행
pnpm dev

# 클라이언트만 실행
pnpm dev:client

# 서버만 실행
pnpm dev:server
```

### 테스트 실행

```bash
# 클라이언트 테스트
pnpm test:client

# 서버 테스트
pnpm test:server

# 모든 테스트 실행
pnpm test
```

### 빌드

```bash
# 클라이언트 및 서버 빌드
pnpm build
```

## 환경 변수 설정

- 클라이언트: `client/.env` 파일에 설정 (예시는 `client/.env.example` 참조)
- 서버: `server/.env` 파일에 설정 (예시는 `server/.env.example` 참조)

## API 엔드포인트

서버는 다음과 같은 기본 API 엔드포인트를 제공합니다:

- `GET /api/health`: 서버 상태 확인
- `GET /api/users`: 유저 목록 조회
- `GET /api/users/:id`: 특정 유저 조회
- `POST /api/users`: 새 유저 추가
- `PUT /api/users/:id`: 유저 정보 수정
- `DELETE /api/users/:id`: 유저 삭제


# 💤 SleepLog

수면 시간을 간단하게 기록하고 관리할 수 있는 풀스택 웹 애플리케이션입니다.  
React + Vite(클라이언트)와 Fastify + Drizzle ORM + SQLite(서버)로 구성되어 있으며, 빠른 개발과 테스트에 용이하도록 설계되었습니다.

---

## ✨ 주요 기능

- 수면 기록 등록 (날짜, 시작/종료 시간, 특이사항)
- 기록된 수면 정보 리스트 조회
- 기록 수정 및 삭제 기능
- 클라이언트와 서버 분리 운영 가능

---

## 🛠️ 기술 스택

### 공통
- **TypeScript**
- **pnpm** (워크스페이스 기반)
- **Prettier**, **ESLint**, **Vitest**

### 클라이언트
- **React 18 + Vite**
- **React Router DOM** (SPA 라우팅)
- **TailwindCSS** (유틸리티 퍼스트 CSS 프레임워크)
- **Axios** (HTTP 클라이언트)

### 서버
- **Fastify** (고성능 Node.js 웹 프레임워크)
- **Drizzle ORM** (타입 안정성을 갖춘 ORM)
- **SQLite** (로컬 환경용 파일 기반 경량 DB)