'use client';

import {
  GetCategoryDocument,
  GetHomeScreensDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import VideoCard from "@/components/video-card";
import Link from "next/link";

import Image from 'next/image';

const Page: NextPage = () => {
  const { data: homeScreenData } = useQuery(GetHomeScreensDocument);
  const { data: VideoData } = useQuery(GetOriginalVideoDocument, {
    variables: { id: '1314' },
  });
  const {
    data: videoCommentsData, //fetchMore
  } = useQuery(GetVideoCommentsDocument, {
    variables: { id: '1480', first: 5 },
  });
  const { data: categoryData } = useQuery(GetCategoryDocument, {
    variables: { id: '2' },
  });

  console.log({ homeScreenData, VideoData, videoCommentsData, categoryData });

  if (!homeScreenData || !VideoData || !videoCommentsData || !categoryData)
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

    console.log("RENDER");

  return (
    <div className="flex gap-1 absolute top-0 left-0 right-0 bottom-0 overflow-scroll  dark:bg-gray-1000">
      <div>
        {homeScreenData.homeScreens.map(({ id, category, videos }) => {
          if (!videos?.length) return null;
          return (
            <section key={id}>
              <h2 className="category text-[24px] font-bold mt-8 mb-2">
                <Link href={`/categories/${category?.id}`}>
                  {category?.name ?? 'unnamed category'}
                </Link>
              </h2>
              <div className="videos flex gap-2">
                {(videos ?? []).map((v) => {
                  return <VideoCard value={v} key={v.id} />;
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
