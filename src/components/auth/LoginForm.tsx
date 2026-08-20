import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { loginSchema, type LoginFormValues } from '@/schemas/loginSchema';

export function LoginForm() {
  const { login, isAuthSubmitting } = useAuth();

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: '', password: '' },
  });

  const isBusy = isSubmitting || isAuthSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    setServerErrorMessage(null);

    const result = await login(values);

    if (!result.success) {
      setServerErrorMessage(result.error.userMessage);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverErrorMessage ? <p role="alert">{serverErrorMessage}</p> : null}

      <div>
        <label htmlFor="login-loginId">아이디</label>
        <input
          id="login-loginId"
          type="text"
          autoComplete="username"
          disabled={isBusy}
          aria-invalid={errors.loginId ? true : undefined}
          {...register('loginId')}
        />
        {errors.loginId ? <p>{errors.loginId.message}</p> : null}
      </div>

      <div>
        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="current-password"
          disabled={isBusy}
          aria-invalid={errors.password ? true : undefined}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          disabled={isBusy}
        >
          {isPasswordVisible ? '숨기기' : '보기'}
        </button>
        {errors.password ? <p>{errors.password.message}</p> : null}
      </div>

      <button type="submit" disabled={isBusy}>
        로그인
      </button>

      <p>
        아직 계정이 없으신가요? <a href={ROUTES.REGISTER}>회원가입</a>
      </p>
    </form>
  );
}