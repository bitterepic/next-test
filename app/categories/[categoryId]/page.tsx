'use client';

import { use, useMemo, useRef } from 'react';
import {
  GetCategoryDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import type { ActiveVideo, ActiveCategory } from '@/lib/types';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import VideoCard from '@/lib/components/video-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Head from "@/lib/components/header";

/**
 * The internal state of the page
 */
interface State {
  reloading: boolean;
  activeVideo?: ActiveVideo;
  activeCategory?: ActiveCategory;
}

/**
 * Organizes the input from the network requests into the internal state of the page.
 * @param props - The page props
 * @returns the constructed state
 */
const useState = (props: PageProps): State => {
  const { videoId: videoId = '' } = use(props.searchParams);
  const { categoryId = '' } = use(props.params);
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
      reloading: false,
    };

    if (categoryId) {
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
    videoCommentsResponse.data,
    videoResponse.data,
    categoryResponse.data,
    categoryId,
    videoId,
  ]);

  console.log(state);
  return state;
};

interface PageProps {
  searchParams: Promise<{ videoId?: string }>;
  params: Promise<{ categoryId?: string }>;
}

/**
 * Page used for showing a single category, as well as an open video as an overlay. 
 * @param props - The page props
 */
const Page: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const { reloading, activeVideo, activeCategory } = useState(props);
  const firstLoadRef = useRef(true);

  if (
    !activeCategory ||
    (firstLoadRef.current && activeVideo && !activeVideo.video)
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
      <Head/>
      {reloading ? <div>Reloading list...</div> : null}
      <div>
        {(() => {
          const { category, id } = activeCategory;
          const videos = category?.videos ?? [];
          if (!videos?.length) return null;
          if (!category) return null;

          return (
            <section key={id} className="my-10">
              <h2 className="category text-[16px] font-bold px-4">
                {category?.name ?? 'unnamed category'}{' '}
                <span className="text-lg font-bold opacity-0">&gt;</span>
              </h2>
              <div className="videos flex flex-row flex-wrap gap-2 overflow-scroll py-10 -my-8 px-4">
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
                        href={`/categories/${category.id}/videos/${v.id}`}
                        active={active}
                        onClose={() => {
                          router.push(`/categories/${category.id}`);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
};

export default Page;
