import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants';

export function ForbiddenPage() {
  return (
    <main>
      <h1>접근 권한이 없습니다.</h1>
      <p>이 페이지를 사용할 권한이 없습니다.</p>
      <Link to={ROUTES.ROOT}>홈으로 이동</Link>
    </main>
  );
}