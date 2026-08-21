import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants';

export function NotFoundPage() {
  return (
    <main>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>요청한 주소가 존재하지 않습니다.</p>
      <Link to={ROUTES.ROOT}>홈으로 이동</Link>
    </main>
  );
}