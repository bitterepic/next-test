import type { Metadata } from 'next';
import { GetCategoryDocument, GetOriginalVideoDocument } from '@/lib/graphql/generated/graphql';
import Content, { type PageProps } from './content';
import { client } from '@/lib/apolloClient';

export async function generateMetadata({
  searchParams,
  params,
}: PageProps): Promise<Metadata> {
  const { videoId: videoId = '' } = await searchParams;
  const { categoryId = '' } = await params;

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
import type { NextPage } from 'next';

/**
 * Page used for showing a single category, as well as an open video as an overlay.
 * @param props - The page props
 */
const Page: NextPage<PageProps> = (props) => {
  return <Content {...props} />;
};

export default Page;
