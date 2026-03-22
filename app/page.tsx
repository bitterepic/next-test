import Content, { type ContentProps } from "./content";
import type { NextPage } from 'next';
import type { Metadata } from 'next'
import { client } from "@/lib/apolloClient";
import { GetCategoryDocument, GetOriginalVideoDocument } from '@/lib/graphql/generated/graphql';

export async function generateMetadata(
  { searchParams } : ContentProps
): Promise<Metadata> {
  const { categoryVideoId: [categoryVideoId = ''] = [] } = await searchParams;
  const [categoryId, videoId] = categoryVideoId.split('-');

  const categoryResponse = categoryId && await client.query({
        query: GetCategoryDocument,
        variables: { id: categoryId },
      }).catch(() => undefined);

  const videoResponse = videoId && await client.query({
        query: GetOriginalVideoDocument,
        variables: { id: videoId },
      }).catch(() => undefined);

  let out = ['SAMANSA'];

  if (categoryResponse) {
    const { name: categoryName } = categoryResponse.data.category;

    out = out.concat([categoryName ?? '']);

    if (videoResponse) {
      const { title: videoTitle } = videoResponse.data.originalVideo ?? {};

      out = out.concat([videoTitle ?? '']);
    }
  }
  return {
    title: out.reverse().join(' | '),
  };
}

/**
 * Page used for showing a list of user categories, as well as an open video as an overlay. 
 * @param props - The page props
 */
const Page: NextPage<ContentProps> = (props) => {
  return <Content {...props}/>;
};

export default Page;
