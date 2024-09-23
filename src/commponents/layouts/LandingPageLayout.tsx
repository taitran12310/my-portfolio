import styles from '@/styles/components/layouts/LandingPageLayout.module.sass';

export default function LandingPageLayout({
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
