
import CatItem from '@/components/catItem';
import Layout from '@/components/Layout.js';
import { useRouter } from 'next/router';
import { getDoneByCat } from '@/modules/Data';

// this is the endpoint "/done/:category"
export default function DoneItemsByCat() {
  const router = useRouter();
  const { category } = router.query;

  return (
    <Layout>
      <CatItem cat={category} done={true} getCatMethod={getDoneByCat} hasCheckBox={false}>
      </CatItem>
    </Layout>
  )
}