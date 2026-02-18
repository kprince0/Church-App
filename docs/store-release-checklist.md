# 스토어 배포 체크리스트

## Android (Google Play)

1. 앱 아이콘/스플래시 생성

```bash
npm run mobile:assets
```

2. Android Studio 열기

```bash
npm run mobile:android
```

3. `Build > Generate Signed Bundle / APK`에서 AAB 생성
4. Play Console에 업로드 후 심사 제출

## iOS (App Store)

1. Xcode + CocoaPods 설치(macOS)
2. 아이콘/스플래시 생성

```bash
npm run mobile:assets
```

3. CocoaPods 설치/업데이트

```bash
sudo gem install cocoapods
cd ios/App && pod install
```

4. Xcode 열기

```bash
npm run mobile:ios
```

5. Signing, Bundle Identifier 확인 후 Archive/배포

## 공통 확인

- `appId`: `org.jkpc.app`
- 앱 이름: `잭슨빌 한인장로교회`
- 개인정보처리방침 URL 준비
- 계정 삭제/지원 이메일 준비
