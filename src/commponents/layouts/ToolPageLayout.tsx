import styles from '@/styles/components/layouts/ToolPageLayout.module.sass';

export default function ToolPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}
