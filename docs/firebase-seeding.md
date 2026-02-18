# Firebase 초기 시드

## 준비

1. Firebase 서비스 계정 키(JSON) 발급
2. 환경변수 설정

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/service-account.json
cp .env.example .env
```

## 실행

```bash
npm run seed:firebase
```

## 시드 결과

- 기본 관리자 Auth 계정 생성/업데이트
- `members/{uid}` 관리자 프로필 업서트 (approved, 시무장로, 재정장로, 전 기관 소속)
- 기관 채팅방 6개 업서트
  - 예배부, 교육부, 재정부, 선교부, 친교부, 관리부

## 기본 관리자 환경변수

- `SEED_DEFAULT_ADMIN_EMAIL`
- `SEED_DEFAULT_ADMIN_PASSWORD`
- `SEED_DEFAULT_ADMIN_KOREAN_NAME`
- `SEED_DEFAULT_ADMIN_ENGLISH_NAME`
- `SEED_DEFAULT_ADMIN_PHONE`
- `SEED_DEFAULT_ADMIN_ADDRESS1`
- `SEED_DEFAULT_ADMIN_CITY`
- `SEED_DEFAULT_ADMIN_STATE`
- `SEED_DEFAULT_ADMIN_ZIP`
