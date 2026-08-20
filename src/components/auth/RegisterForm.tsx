import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/schemas/registerSchema';

export function RegisterForm() {
  const { register: registerUser, isAuthSubmitting } = useAuth();

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      loginId: '',
      displayName: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const isBusy = isSubmitting || isAuthSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    setServerErrorMessage(null);

    const result = await registerUser(values);

    if (!result.success) {
      setServerErrorMessage(result.error.userMessage);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverErrorMessage ? <p role="alert">{serverErrorMessage}</p> : null}

      <div>
        <label htmlFor="register-loginId">아이디</label>
        <input
          id="register-loginId"
          type="text"
          autoComplete="username"
          disabled={isBusy}
          aria-invalid={errors.loginId ? true : undefined}
          {...register('loginId')}
        />
        {errors.loginId ? <p>{errors.loginId.message}</p> : null}
      </div>

      <div>
        <label htmlFor="register-displayName">활동명</label>
        <input
          id="register-displayName"
          type="text"
          autoComplete="nickname"
          disabled={isBusy}
          aria-invalid={errors.displayName ? true : undefined}
          {...register('displayName')}
        />
        {errors.displayName ? <p>{errors.displayName.message}</p> : null}
      </div>

      <div>
        <label htmlFor="register-password">비밀번호</label>
        <input
          id="register-password"
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="new-password"
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

      <div>
        <label htmlFor="register-passwordConfirm">비밀번호 확인</label>
        <input
          id="register-passwordConfirm"
          type={isPasswordConfirmVisible ? 'text' : 'password'}
          autoComplete="new-password"
          disabled={isBusy}
          aria-invalid={errors.passwordConfirm ? true : undefined}
          {...register('passwordConfirm')}
        />
        <button
          type="button"
          onClick={() => setIsPasswordConfirmVisible((prev) => !prev)}
          disabled={isBusy}
        >
          {isPasswordConfirmVisible ? '숨기기' : '보기'}
        </button>
        {errors.passwordConfirm ? (
          <p>{errors.passwordConfirm.message}</p>
        ) : null}
      </div>

      <button type="submit" disabled={isBusy}>
        회원가입
      </button>

      <p>
        이미 계정이 있으신가요? <a href={ROUTES.LOGIN}>로그인</a>
      </p>
    </form>
  );
}