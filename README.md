# Pokemon Gacha Shop

디스코드 커뮤니티 전용 가상 코인/카드 가챠 웹 서비스 (실제 금전 거래 없음).

## 시작하기

npm install
npm run dev

## Firebase 설정

이 프로젝트를 실행하려면 Firebase 프로젝트 연결이 필요합니다.
자세한 절차는 [docs/firebase/FIREBASE_WEB_SETUP.md](./docs/firebase/FIREBASE_WEB_SETUP.md) 문서를 참고하세요.

1. `.env.example` 파일을 참고해 `.env.local` 파일을 만듭니다.
2. Firebase Console에서 발급받은 값을 `.env.local`에 입력합니다.
3. `.env.local`은 Git에 올라가지 않습니다 (`.gitignore`에 등록됨).