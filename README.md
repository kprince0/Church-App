# 잭슨빌 한인장로교회 앱

Firebase(Auth/Firestore/Storage) 기반 교회 통합 앱입니다.

## 핵심 기능

- 교인 등록/승인 워크플로우
- 개인/기관 채팅 + 파일/사진 전송
- 관리자 개별 공지 발송
- 개인 헌금 조회 + 재정장로 CRUD
- 설교 링크 관리(시무장로/담임목사)
- 주보 업로드/열람
- 관리자 콘솔(승인/권한/헌금관리)
- PWA + Capacitor Android/iOS 파이프라인

## 실행

```bash
cp .env.example .env
npm install
npm run dev
```

개발 서버: `http://localhost:9002`

## Firebase 설정

필수 환경변수는 `.env.example` 참고.

규칙 배포:

```bash
firebase deploy --only firestore:rules,storage
```

## Firebase 초기 시드

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/service-account.json
npm run seed:firebase
```

상세: `docs/firebase-seeding.md`

## 모바일 빌드 파이프라인

아이콘/스플래시 생성 + 네이티브 동기화:

```bash
npm run mobile:assets
```

Android 열기:

```bash
npm run mobile:android
```

iOS 열기:

```bash
npm run mobile:ios
```

참고: 현재 환경에서 iOS는 `pod`가 없으면 동기화 실패할 수 있습니다. macOS + CocoaPods 필요.

상세: `docs/store-release-checklist.md`

## 보안 규칙

- Firestore: 필드 단위 shape/type 검증 + 역할 기반 접근
- Storage: 채팅방 멤버 기반 접근 + MIME/용량 제한
