import { ReactElement, useEffect } from 'react';
import Layout from '@/commponents/layouts/Layout'
import ToolPageLayout from '@/commponents/layouts/ToolPageLayout'
import type { NextPageWithLayout } from '@/pages/_app'

const ToolA: NextPageWithLayout = () => {
  useEffect(() => {

  }, [])

  return (
    <>ToolA Page</>
  )

}

ToolA.getLayout = function getLayout(home: ReactElement) {
  return (
    <Layout>
      <ToolPageLayout>
        {home}
      </ToolPageLayout>
    </Layout>
  )
}

export default ToolA;