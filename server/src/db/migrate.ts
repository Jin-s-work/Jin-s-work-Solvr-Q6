import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import env from '../config/env'
import { users, sleeps } from './schema'       // ★ sleeps 스키마 추가
import { UserRole } from '../types'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// 초기 사용자 데이터 (기존 코드)
const initialUsers = [
  {
    name: '관리자',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '일반 사용자',
    email: 'user@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '게스트',
    email: 'guest@example.com',
    role: UserRole.GUEST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 데이터베이스 마이그레이션 및 초기 데이터 삽입
async function runMigration() {
  try {
    // 1) 데이터베이스 디렉토리 생성
    await ensureDatabaseDirectory()

    // 2) 데이터베이스 연결
    const sqlite = new Database(env.DATABASE_URL)
    const db = drizzle(sqlite)

    // 3) users 테이블 생성
    console.log('users 테이블 생성 중...')
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'USER',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // 4) 초기 사용자 데이터 삽입
    console.log('초기 사용자 데이터 삽입 중...')
    const existingUsers = await db.select().from(users)
    if (existingUsers.length === 0) {
      for (const user of initialUsers) {
        await db.insert(users).values(user)
      }
      console.log(`${initialUsers.length}명의 사용자가 추가되었습니다.`)
    } else {
      console.log('사용자 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.')
    }

    // ====================================================
    // 5) sleeps 테이블 생성 (★ 새로 추가된 부분)
    console.log('sleeps 테이블 생성 중...')
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleeps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        sleep_start TEXT NOT NULL,
        sleep_end TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // (★ 원한다면 초기 sleep 데이터 삽입 로직 추가 가능)
    // 예시: 첫 레코드가 없을 때 기본값 하나 삽입
    const existingSleeps = await db.select().from(sleeps)
    if (existingSleeps.length === 0) {
      console.log('기본 수면 데이터가 없습니다. 초기값을 삽입하지 않습니다.')
    } else {
      console.log('기존 수면 데이터가 이미 존재합니다. 초기 삽입 건너뜁니다.')
    }
    // ====================================================

    console.log('데이터베이스 마이그레이션이 완료되었습니다.')
  } catch (error) {
    console.error('데이터베이스 마이그레이션 중 오류가 발생했습니다:', error)
    process.exit(1)
  }
}

// 스크립트가 직접 실행된 경우에만 마이그레이션 실행
if (require.main === module) {
  runMigration()
}

export default runMigration
