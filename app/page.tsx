'use client';

import { use } from 'react';
import { createPortal } from 'react-dom';
import {
  GetCategoryDocument,
  GetHomeScreensDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import VideoCard from '@/components/video-card';
import Link from 'next/link';

import Image from 'next/image';

const Page: NextPage<{
  searchParams: Promise<{ videoId?: string[]; categoryId?: string[] }>;
}> = (props) => {
  const { categoryId:[categoryId] =[], videoId: [videoId] = [] } = use(props.searchParams);
  const { data: homeScreenData, loading: homeScreenLoading } = useQuery(
    GetHomeScreensDocument,
  );
  const { data: videoData, loading: videoDataLoading } = useQuery(
    GetOriginalVideoDocument,
    {
      variables: { id: videoId ?? '-1' },
      skip: !videoId,
    },
  );
  const {
    data: videoCommentsData, //fetchMore
    loading: videoCommentsLoading,
  } = useQuery(GetVideoCommentsDocument, {
    variables: { id: videoId ?? '-1', first: 5 },
    skip: !videoId,
  });
  const { data: categoryData } = useQuery(GetCategoryDocument, {
    variables: { id: categoryId ?? '-1' },
    skip: !categoryId,
  });
  console.log({ categoryId });

  if (!homeScreenData)
    return (
      <div className="flex items-center content-center justify-center absolute left-0 bottom-0 right-0 top-0">
        <Image
          src="/spinner.svg"
          className="dark:invert animate-spin"
          width={64}
          height={64}
          alt="Loading..."
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-1 absolute top-0 left-0 right-0 bottom-0 overflow-scroll  dark:bg-gray-1000">
      <h1 className="branding text-[24px] font-bold py-4 px-4">
        <Link href="/">Samansa</Link>
      </h1>
      <div>
        {homeScreenData.homeScreens.map(({ id, category, videos }) => {
          if (!videos?.length) return null;
          return (
            <section key={id}>
              <h2 className="category text-[16px] font-bold mt-4 -mb-2 px-4">
                <Link href={`/categories/${category?.id}`}>
                  {category?.name ?? 'unnamed category'}
                  {(() => {
                    if (
                      category?.id === categoryData?.category.id &&
                      categoryData
                    ) {
                          return createPortal(
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 1000,
                                backgroundColor: 'green',
                              }}
                            >
                              <Link href="/">close</Link>
                              <pre>{JSON.stringify(categoryData, null, 4)}</pre>
                            </div>,
                            document.body,
                          );
                    }
                    return null;
                  })()}
                </Link>
              </h2>
              <div className="videos flex flex-row gap-2 overflow-scroll py-4 px-4">
                {(videos ?? []).map((v) => {
                  return (
                    <div key={v.id}>
                      <VideoCard value={v} />
                      {(() => {
                        if (videoData && videoData.originalVideo?.id === v.id) {
                          return createPortal(
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 1000,
                                backgroundColor: 'green',
                              }}
                            >
                              <Link href="/">close</Link>
                              <pre>{JSON.stringify(videoData, null, 4)}</pre>
                            </div>,
                            document.body,
                          );
                        }

                        return null;
                      })()}
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
