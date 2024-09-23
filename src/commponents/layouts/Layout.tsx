// import useSWR from 'swr';
import '@/styles/globals.sass';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Head from 'next/head';

const geistSans = localFont({
  src: '../../app/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../../app/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: `TaiTran's Portfolio`,
};

// Define the structure of the expected API response
// interface NavigationData {
//   links: Array<{ href: string; label: string }>;
// }

// Fetcher function to handle API requests
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout = ({ children }: Readonly<{children: React.ReactNode;}>) => {
  // const { data, error } = useSWR<NavigationData>('/api/navigation', fetcher);

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>{metadata.title?.toString() || ''}</title>
        <meta
          name="description"
          content={`${metadata.description}`}
          key="desc"
        />
      </Head>
      <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </main>
    </>
  );
}

export default Layout;
