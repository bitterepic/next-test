'use client';

import { use, useMemo, useRef } from 'react';
import {
  GetHomeScreensDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import type { HomeScreen, ActiveVideo, ActiveCategory } from '@/lib/types';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import VideoCard from '@/lib/components/video-card';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from "@/lib/components/header";

/**
 * The state for the page.
 */
interface State {
  homeScreens: HomeScreen[];
  reloading: boolean;
  activeVideo?: ActiveVideo;
  activeCategory?: ActiveCategory;
}

const useParameterData = (props: ContentProps) => {
  const { categoryVideoId: [categoryVideoId = ''] = [] } = use(
    props.searchParams,
  );
  const [categoryId, videoId] = categoryVideoId.split('-');

  return { categoryId, videoId };
}

/**
 * Organizes the input from the network requests into the internal state of the page.
 * @param props - The page props
 * @returns the constructed state
 */
const useState = (props: ContentProps): State => {
  const { categoryId, videoId } = useParameterData(props);
  const homeResponse = useQuery(GetHomeScreensDocument);
  const videoResponse = useQuery(GetOriginalVideoDocument, {
    variables: { id: videoId ?? '-1' },
    skip: !videoId,
  });
  const videoCommentsResponse = useQuery(GetVideoCommentsDocument, {
    variables: { id: videoId, first: 5 },
    skip: !videoId,
  });
  const state: State = useMemo(() => {
    const out: State = {
      homeScreens: homeResponse.data?.homeScreens ?? [],
      reloading: homeResponse.data ? homeResponse.loading : false,
    };

    if (!videoId && categoryId) {
      const activeCategory = homeResponse.data?.homeScreens.find(
        (hs) => hs.category?.id === categoryId,
      )?.category;

      if (activeCategory) {
        out.activeCategory = {
          id: categoryId,
          category: activeCategory,
        };
      }
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
    categoryId,
    videoId,
  ]);

  return state;
};

export interface ContentProps {
  searchParams: Promise<{ categoryVideoId?: string[] }>;
}

/**
 * Page used for showing a list of user categories, as well as an open video as an overlay. 
 * @param props - The page props
 */
const Page: NextPage<ContentProps> = (props) => {
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
    <div className="flex flex-col gap-1 absolute top-0 left-0 right-0 bottom-0 overflow-scroll  dark:bg-gray-1000 transform-gpu pl-8 ">
      <Header/>
      {reloading ? <div>Reloading list...</div> : null}
      <div>
        {homeScreens.map(({ id, category, videos }) => {
          if (!videos?.length) return null;
          if (!category) return null;

          return (
            <section key={id} className="my-10">
              <h2 className="category text-[16px] font-bold px-4">
                <Link
                  href={`/categories/${category?.id}`}
                  className="hover:underline"
                >
                  {category?.name ?? 'unnamed category'}{' '}
                  <span className="text-lg font-bold">&gt;</span>
                </Link>
              </h2>
              <div className="videos flex flex-row gap-2 overflow-scroll py-10 -my-8 px-4">
                {(videos ?? []).map((v) => {
                  const active =
                    activeVideo?.id === v.id &&
                    activeVideo?.categoryId === category?.id
                      ? activeVideo
                      : undefined;

                  debugger;
                  return (
                    <div key={v.id}>
                      <VideoCard
                        value={v}
                        category={category}
                        active={active}
                        href={`/videos/${category.id}-${v.id}`}
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
