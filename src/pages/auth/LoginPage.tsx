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
    clearTerminationInfo();
  }, [terminationInfo, clearTerminationInfo]);

  return (
    <div>
      <h2>로그인</h2>
      {announcedMessage ? <p role="alert">{announcedMessage}</p> : null}
      <LoginForm />
    </div>
  );
}