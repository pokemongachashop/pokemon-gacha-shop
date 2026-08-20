import { useEffect, useState } from 'react';

import { LoginForm } from '@/components/auth/LoginForm';
import { AUTOMATIC_LOGOUT_MESSAGES } from '@/constants';
import { useSession } from '@/hooks';

export function LoginPage() {
  const { terminationInfo, clearTerminationInfo } = useSession();

  const [announcedMessage, setAnnouncedMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!terminationInfo) {
      return;
    }

    setAnnouncedMessage(AUTOMATIC_LOGOUT_MESSAGES[terminationInfo.reason]);
    // 한 번만 표시하기 위해 확인 즉시 Session Storage와 상태를 비운다.
    clearTerminationInfo();
  }, [terminationInfo, clearTerminationInfo]);

  return (
    <main>
      <h1>로그인</h1>
      {announcedMessage ? <p role="alert">{announcedMessage}</p> : null}
      <LoginForm />
    </main>
  );
}