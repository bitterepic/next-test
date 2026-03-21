'use client';

import { HomeScreen, ActiveVideo, Category } from '@/lib/types';
import { type FC } from 'react';
import Portal from '@/lib/components/portal';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import { useRef, useEffect, useState } from 'react';

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const VideoCard: FC<{
  value: Exclude<HomeScreen['videos'], undefined | null>[number];
  active?: ActiveVideo;
  category: Category;
  onClose?: () => void;
}> = (props) => {
  const {
    value: { id, landscapeThumbnail, title, duration },
    onClose,
    active,
    category,
  } = props;
  const width = 320;
  const height = 180;
  const gradientHeight = 600;
  const ref = useRef<HTMLAnchorElement>(null);

  const [dimensions, setDimensions] = useState<Rect>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [previousActive, setPreviousActive] = useState<ActiveVideo | null>(
    null,
  );

  useEffect(() => {
    if (active && previousActive !== active) {
      setTimeout(() => {
        setPreviousActive(active);
      }, 100);
    } else if (!active && previousActive) {
      setTimeout(() => {
        setPreviousActive(null);
      }, 400);
    }
  }, [active]);

  const cardFragment = (
    <div
      className={classnames(
        'relative',
        'bg-neutral-100',
        'relative',
        'z-0',
        'rounded-md',
        'block',
        'overflow-hidden',
        'shadow-lg/30',
        'dark:shadow-white/50',
        ...(!active && !previousActive
          ? [
              'hover:scale-110',
              'hover:z-1',
              'active:scale-105',
              'active:z-1',
              'focus:scale-110',
              'focus:z-1',
            ]
          : []),
        'transition-all',
        'group',
      )}
      style={{
        height,
        width,
        ...(active ? { width: width * 2, height: height * 2 } : {}),
      }}
    >
      <div
        className={classnames(
          'info-caption',
          'z-2',
          'absolute',
          'bottom-0',
          'left-0',
          'right-0',
          'p-1',
          'pointer-events-none',
          'flex',
          'flex-row',
          'align-start',
          'justify-start',
          'items-start',
          'opacity-0',
          ...(!active && !previousActive
            ? [
                'group-hover:opacity-100',
                'group-focus:opacity-100',
                'group-active:opacity-100',
              ]
            : []),
          'transition-all',
        )}
      >
        <div className="flex-1" style={{ flex: 1 }}></div>
        <div className="flex flex-row gap-[2px]  bg-black/40 rounded-full px-2 backdrop-blur-lg">
          <Image
            src="/clock.svg"
            width="16"
            height="16"
            alt="時間"
            className="invert drop-shadow-sm"
          ></Image>
          <div className="duration text-white text-shadow-sm">
            {duration.minutes}:{String(duration.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
      <div
        className={classnames(
          'gradient',
          'z-1',
          'absolute',
          'left-0',
          'right-0',
          `top-[-600px]`,
          'bg-linear-[25deg,transparent_10%,rgba(255,255,255,.4)_60%,transparent_90%]',
          'transition-none',
          ...(!active && !previousActive
            ? [
                'group-hover:transition-all',
                `group-hover:top-[600px]`,
                'group-active:transition-all',
                `group-active:top-[600px]`,
                'group-focus:transition-all',
                `group-focus:top-[600px]`,
              ]
            : []),
          'duration-1000',
          'pointer-events-none',
        )}
        style={{ height: `${gradientHeight}px` }}
      ></div>
      <Image
        src={landscapeThumbnail ?? ''}
        className="object-cover object-contain absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none"
        layout="fill"
        alt={title ?? ''}
      />
    </div>
  );

  const dialogFragment = (() => {
    if (active || previousActive) {
      const a = active || previousActive;

      if (!a) return null;

      return (
        <Portal>
          <div
            className={classnames(
              'absolute',
              'top-0',
              'left-0',
              'right-0',
              'bottom-0',

              ...(previousActive === active
                ? ['backdrop-blur-sm', 'bg-black/50']
                : ['backdrop-blur-none', 'bg-transparent']),
              'duration-500',
              'transition-all',
            )}
          ></div>
          <div
            className={[
              `video-id-${a.id}`,
              `category-id-${category.id}`,
              'transition-all',
              'ease-in-out',
              'overflow-hidden',
              'flex',
              'flex-row',
              'items-center',
              'justify-center',
            ].join(' ')}
            style={{
              minHeight: height,
              minWidth: width,
              //maxHeight: '100vh',
              position: 'absolute',
              ...(() => {
                if (active !== previousActive) {
                  return dimensions;
                } else {
                  return {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  };
                }
              })(),
              transition: 'all .5s ease',
              zIndex: 1000,
            }}
          >
            <div
              className={classnames(
                'bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-row',
              )}
              style={{ maxWidth: 800 }}
            >
              <div className="flex flex-col relative">
                <div
                  style={{
                    width,
                    height,
                    ...(active ? { width: width * 2, height: height * 2 } : {}),
                  }}
                >
                  {cardFragment}
                </div>
                <div
                  className="px-4"
                  style={{
                    height: 0,
                    width: 0,
                    overflow: 'auto',
                    transition: 'all .5s ease',
                    ...(active === previousActive
                      ? { height: 300, width: width * 2, minWidth: width * 2 }
                      : {}),
                  }}
                >
                  <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: 10, left: 10 }}
                  >
                    <Image
                      width={32}
                      height={32}
                      src="/xmark.svg"
                      alt={'閉じる'}
                      className="dark:invert drop-shadow-sm"
                    />
                  </button>
                  <dl>
                    <dt className="text-sm font-bold mt-4">Title</dt>
                    <dd className="mb-4 text-md">{a.video?.title}</dd>
                    <dt className="text-sm font-bold mt-4">Description</dt>
                    <dd className="mb-4 text-md">{a.video?.description}</dd>
                    <div className="flex flex-row gap-4">
                      <div>
                        <dt className="text-sm font-bold">Likes</dt>
                        <dd className="mb-4 text-md flex flex-row gap-1">
                          <Image
                            src="/thumb-up.svg"
                            width="16"
                            height="16"
                            alt="時間"
                            className="invert drop-shadow-sm"
                          ></Image>
                          {a.video?.likeNum}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-bold">Duration</dt>
                        <dd className="mb-4 text-md flex flex-row gap-1">
                          <Image
                            src="/clock.svg"
                            width="16"
                            height="16"
                            alt="時間"
                            className="invert drop-shadow-sm"
                          ></Image>
                          {a.video?.duration.minutes}:
                          {String(a.video?.duration.seconds).padStart(2, '0')}
                        </dd>
                      </div>
                    </div>
                  </dl>
                        <div className="text-sm font-bold">Comments</div>
                  <ul>
                    {(a.comments?.edges ?? []).map((e) => {
                      if (e.node) {
                        return (
                          <div key={e.node.id} className={classnames('m-4')}>
                            <div className="flex flex-row items-center gap-4">
                            <div className="font-bold">@{e.node.user?.name}</div>
                              <div className="text-sm">
                                {new Date(
                                  e.node.createdAt,
                                ).toLocaleDateString()}{' '}
                                {new Date(
                                  e.node.createdAt,
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                            <div>{e.node.contents}</div>

                        <div className="mb-4 text-md flex flex-row gap-1">
                          <Image
                            src="/thumb-up.svg"
                            width="16"
                            height="16"
                            alt="時間"
                            className="invert drop-shadow-sm"
                          ></Image>
                          {e.node.likeNum}
                        </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      );
    }
    return null;
  })();

  return (
    <>
      {dialogFragment}
      <Link
        key={id}
        ref={ref}
        style={{
          width,
          height,
          minWidth: width,
          visibility: dialogFragment ? 'hidden' : 'visible',
        }}
        href={`/categories/${category.id}/videos/${id}`}
      >
        <div
          style={{ width, height, minWidth: width }}
          onClick={() => {
            if (ref.current) {
              const { top, left, right, bottom } =
                ref.current.getBoundingClientRect();

              if (
                top !== dimensions.top ||
                bottom !== dimensions.bottom ||
                left !== dimensions.left ||
                right !== dimensions.right
              ) {
                setDimensions({ top, left, right, bottom });
              }
            }
          }}
        >
          {cardFragment}
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
