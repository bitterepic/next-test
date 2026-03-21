'use client';

import { use, useMemo, useRef } from 'react';
import {
  GetCategoryDocument,
  GetHomeScreensDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import type { State } from '@/lib/types';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import VideoCard from '@/lib/components/video-card';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const useState = (props: PageProps): State => {
  const { categoryId: [categoryId = ''] = [], videoId: [videoId = ''] = [] } =
    use(props.searchParams);
  const homeResponse = useQuery(GetHomeScreensDocument);
  const videoResponse = useQuery(GetOriginalVideoDocument, {
    variables: { id: videoId ?? '-1' },
    skip: !videoId,
  });
  const videoCommentsResponse = useQuery(GetVideoCommentsDocument, {
    variables: { id: videoId, first: 5 },
    skip: !videoId,
  });
  const categoryResponse = useQuery(GetCategoryDocument, {
    variables: { id: categoryId },
    skip: !categoryId,
  });

  const state: State = useMemo(() => {
    const out: State = {
      homeScreens: homeResponse.data?.homeScreens ?? [],
      reloading: homeResponse.data ? homeResponse.loading : false,
    };

    if (!videoId && categoryId) {
      out.activeCategory = {
        id: categoryId,
        category: categoryResponse.data?.category,
      };
    }

    if (videoId && categoryId) {
      out.activeVideo = {
        id: videoId,
        video: videoResponse.data?.originalVideo,
        comments: videoCommentsResponse.data?.videoComments,
        categoryId,
      };
    }

    return out;
  }, [
    homeResponse.data,
    videoCommentsResponse.data,
    videoResponse.data,
    homeResponse.loading,
    categoryResponse.data,
    categoryId,
    videoId,
  ]);

  return state;
};

interface PageProps {
  searchParams: Promise<{ videoId?: string[]; categoryId?: string[] }>;
}

const Page: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const { homeScreens, reloading, activeVideo, activeCategory } =
    useState(props);
  const firstLoadRef = useRef(true);

  if (
    !homeScreens ||
    (firstLoadRef.current &&
      ((activeVideo && !activeVideo.video) ||
        (activeCategory && !activeCategory.category)))
  )
    return (
      <div className="flex items-center content-center justify-center absolute left-0 bottom-0 right-0 top-0">
        <Image
          src="/spinner.svg"
          loading="eager"
          className="dark:invert animate-spin"
          width={64}
          height={64}
          alt="Loading..."
        />
      </div>
    );

  firstLoadRef.current = false;

  return (
    <div className="flex flex-col gap-1 absolute top-0 left-0 right-0 bottom-0 overflow-scroll  dark:bg-gray-1000 transform-gpu">
      <h1 className="branding text-[24px] font-bold py-4 px-4">
        <Link href="/">Samansa</Link>
      </h1>
      {reloading ? <div>Reloading list...</div> : null}
      <div>
        {homeScreens.map(({ id, category, videos }) => {
          if (!videos?.length) return null;
          if (!category) return null;

          return (
            <section key={id} className="my-10">
              <h2 className="category text-[16px] font-bold px-4">
                <Link href={`/categories/${category?.id}`}>
                  {category?.name ?? 'unnamed category'}
                  {(() => {
                    return null;
                    // if (
                    //   category?.id === activeCategory?.id &&
                    //   activeCategory?.category
                    // ) {
                    //   return createPortal(
                    //     <div
                    //       style={{
                    //         position: 'absolute',
                    //         top: 0,
                    //         left: 0,
                    //         right: 0,
                    //         bottom: 0,
                    //         zIndex: 1000,
                    //         backgroundColor: 'green',
                    //       }}
                    //     >
                    //       <Link href="/">close</Link>
                    //       <pre>
                    //         {JSON.stringify(activeCategory?.category, null, 4)}
                    //       </pre>
                    //     </div>,
                    //     document.body,
                    //   );
                    // }
                    // return null;
                  })()}
                </Link>
              </h2>
              <div className="videos flex flex-row gap-2 overflow-scroll py-10 -my-8 px-4">
                {(videos ?? []).map((v) => {
                  const active =
                    activeVideo?.id === v.id &&
                    activeVideo?.categoryId === category?.id
                      ? activeVideo
                      : undefined;

                  return (
                    <div key={v.id}>
                      <VideoCard
                        value={v}
                        category={category}
                        active={active}
                        onClose={() => {
                          router.push('/');
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
