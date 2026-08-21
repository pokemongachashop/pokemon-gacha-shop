import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="auth-layout__content">
        <header className="auth-layout__header">
          <h1>Pokemon Gacha Shop</h1>
        </header>

        <section className="auth-layout__panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}