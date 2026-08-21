import type { PropsWithChildren, ReactNode } from 'react';

export type PageContainerProps = PropsWithChildren<{
  title?: string;
  description?: string;
  action?: ReactNode;
}>;

export function PageContainer({
  title,
  description,
  action,
  children,
}: PageContainerProps) {
  return (
    <section className="page-container">
      {(title || description || action) && (
        <header className="page-container__header">
          <div>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
          </div>

          {action && <div className="page-container__action">{action}</div>}
        </header>
      )}

      <div className="page-container__content">{children}</div>
    </section>
  );
}