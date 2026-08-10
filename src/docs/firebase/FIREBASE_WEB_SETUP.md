# Firebase Web App 설정 안내

## 1. Firebase 프로젝트 선택
Firebase Console에서 `pokemon-gacha-shop` 프로젝트를 선택합니다.

## 2. Web App 등록
프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가
- 앱 이름: `pokemon-gacha-shop-web`
- Firebase Hosting 설정은 선택하지 않습니다.

## 3. Config 확인
등록 후 표시되는 값 중 아래 5개만 사용합니다.
- apiKey
- authDomain
- projectId
- messagingSenderId
- appId

`storageBucket` 값은 이 프로젝트에서 사용하지 않습니다.

## 4. .env.local 생성
프로젝트 루트에 `.env.local` 파일을 만들고, `.env.example`의 항목에
Firebase Console에서 확인한 실제 값을 입력합니다.

## 5. 환경 변수 Git Commit 금지
`.env.local`은 `.gitignore`에 등록되어 있어 Git에 올라가지 않습니다.
실제 값을 문서나 코드에 직접 적지 않습니다.

## 6. 개발 서버 재시작
`.env.local`을 수정한 뒤에는 `npm run dev`를 다시 실행해야 값이 반영됩니다.

## 7. Authentication 준비 (다음 Task를 위한 사전 설정)
Firebase Console → Build → Authentication → Get Started →
Sign-in method → Email/Password 활성화

## 8. Firestore 준비 (다음 Task를 위한 사전 설정)
Firebase Console → Build → Firestore Database → Create Database →
Production Mode 선택 → Location은 `asia-northeast3` 권장

Production Mode에서는 초기 Security Rules가 모든 접근을 차단합니다.
지금은 정상이며, Security Rules는 이후 별도 Task에서 작성합니다.