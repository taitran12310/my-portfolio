import { ReactElement, useEffect } from 'react';
import Layout from '@/commponents/layouts/Layout'
import LandingPageLayout from '@/commponents/layouts/LandingPageLayout'
import type { NextPageWithLayout } from '@/pages/_app'
import styles from '@/styles/pages/HomePage.module.sass'

const Home: NextPageWithLayout = () => {
  useEffect(() => {

  }, [])

  return (
    <div className={styles.container}>
      Home Page
    </div>
  )

}

Home.getLayout = function getLayout(home: ReactElement) {
  return (
    <Layout>
      <LandingPageLayout>
        {home}
      </LandingPageLayout>
    </Layout>
  )
}

export default Home;