
import CatItem from '@/components/catItem';
import Layout from '@/components/Layout.js'
import { useRouter } from 'next/router';
import { getTodoByCat } from '@/modules/Data';

// this is the endpoint "/todos/:category"
export default function ToDoItemsByCat() {
  const router = useRouter();
  const { category } = router.query;

  return (
    <Layout>
      <CatItem cat={category} done={false} getCatMethod={getTodoByCat} hasCheckBox={true}>
      </CatItem>
    </Layout>
  )
}