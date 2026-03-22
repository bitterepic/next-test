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

/**
 * Helper for returning true after a component is mounted.  Useful for
 * disabling transitions on initial page load.
 */
const useMounted = (onMounted: () => void) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setTimeout(() => {
        setMounted(true);
        onMounted();
      }, 1000);
    }
  }, [mounted, setMounted, onMounted]);

  return mounted;
};

/**
 * A component for rendering a video card.  It also includes the functionality to show a detail view.
 * @param props.value - The configuration for the display of the card 
 * @param props.href - The link url for when the card it clicked.
 * @param props.active - The modal shown when the card is open.
 * @param props.category - The category containing the video
 */
const VideoCard: FC<{
  value: Exclude<HomeScreen['videos'], undefined | null>[number];
  href: string;
  active?: ActiveVideo;
  category: Category;
  onClose?: () => void;
}> = (props) => {
  const {
    value: { id, landscapeThumbnail, title, duration },
    onClose,
    active,
    category,
    href,
  } = props;
  const mounted = useMounted(() => syncDimensions());
  const width = 320;
  const height = 180;
  const gradientHeight = 600;
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    syncDimensions();
    // eslint-disable-next-line
  }, []);

  const syncDimensions = () => {
    if (ref.current) {
      const { top, left, right, bottom } = ref.current.getBoundingClientRect();

      if (
        top !== dimensions.top ||
        bottom !== dimensions.bottom ||
        left !== dimensions.left ||
        right !== dimensions.right
      ) {
        setDimensions({ top, left, right, bottom });
      }
    }
  };

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
    if (mounted) {
      if (active && previousActive !== active) {
        setTimeout(() => {
          setPreviousActive(active);
        }, 100);
      } else if (!active && previousActive) {
        setTimeout(() => {
          setPreviousActive(null);
        }, 400);
      }
    } else {
      if (active && previousActive !== active) {
        setPreviousActive(active);
      } else if (!active && previousActive) {
        setPreviousActive(null);
      }
    }
    // eslint-disable-next-line
  }, [active]);

  const cardFragment = (
    <div
      title={title ?? undefined}
      className={classnames(
        'relative',
        'bg-neutral-100',
        'relative',
        'z-0',
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
              'rounded-md',
            ]
          : ['rounded-none']),
        ...(mounted ? ['transition-all'] : []),
        'group',
      )}
      style={{
        height,
        width,
        ...(active === previousActive
          ? { width: (width * 4) / 3, height: (height * 4) / 3 }
          : {}),
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

          ...(mounted ? ['transition-all'] : []),
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
      {active && active !== previousActive ? (
        <div className="z-100 absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/20">
          <Image
            src="/spinner.svg"
            width="64"
            loading="eager"
            height="64"
            alt="時間"
            className="invert drop-shadow-sm animate-spin"
          ></Image>
        </div>
      ) : null}
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
      <div
        className={classnames(
          'absolute',
          'top-0',
          'left-0',
          'right-0',
          'bottom-0',
          'z-0',
          'pointer-events-none',
          'bg-contain',
        )}
        style={{
          backgroundImage: `url(${JSON.stringify(landscapeThumbnail ?? '')})`,
        }}
      ></div>
    </div>
  );

  const dialogFragment = (() => {
    const a = active || previousActive;

    if ((active || previousActive) && a) {
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
              ...(mounted ? ['transition-all'] : ['transition-none']),
            )}
            onClick={onClose}
          ></div>
          <div
            className={[
              `video-id-${a.id}`,
              `category-id-${category.id}`,
              ...(mounted ? ['transition-all'] : ['transition-none']),
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
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              ...(() => {
                if (
                  (active && !previousActive) ||
                  (!active && previousActive)
                ) {
                  return {
                    left: dimensions.left + width / 2,
                    top: dimensions.top + height / 2,
                  };
                } else {
                  return {
                    top: '50%',
                    left: '50%',
                  };
                }
              })(),
              transition: mounted ? 'all .5s ease' : undefined,
              zIndex: 1000,
            }}
          >
            <div
              className={classnames(
                'bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-row',
              )}
            >
              <div className="flex flex-col relative">
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 10,
                    left: 10,
                    zIndex: 10,
                  }}
                >
                  <Image
                    width={32}
                    height={32}
                    src="/xmark.svg"
                    alt={'閉じる'}
                    className="invert dark:invert drop-shadow-lg/50"
                  />
                </button>
                <div>{cardFragment}</div>
                <div
                  className={classnames(
                    'overflow-auto',
                    'relative',
                    'transition-all',
                  )}
                  style={{
                    height: 0,
                    width: 0,
                    ...(active && active === previousActive
                      ? {
                          height: 250,
                          width: (width * 4) / 3,
                          minWidth: (width * 4) / 3,
                          transitionDelay: '300ms',
                          transitionDuration: '500ms',
                        }
                      : {}),
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 px-4">
                    <dl>
                      <dd className="my-4 text-xl font-bold">
                        {a.video?.title}
                      </dd>
                      <dd className="mb-4 text-md">{a.video?.description}</dd>
                      <div className="flex flex-row gap-4">
                        <div>
                          <dd className="mb-4 text-md flex flex-row gap-1">
                            <Image
                              src="/thumb-up.svg"
                              width="16"
                              height="16"
                              alt="時間"
                              className="dark:invert drop-shadow-sm"
                            ></Image>
                            {a.video?.likeNum}
                          </dd>
                        </div>
                        <div>
                          <dd className="mb-4 text-md flex flex-row gap-1">
                            <Image
                              src="/clock.svg"
                              width="16"
                              height="16"
                              alt="時間"
                              className="dark:invert drop-shadow-sm"
                            ></Image>
                            {a.video?.duration.minutes}:
                            {String(a.video?.duration.seconds).padStart(2, '0')}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              <div
                className={classnames(
                  'bg-neutral-800/70',
                  'flex-1',
                  ...(mounted ? ['transition-all'] : ['transition-none']),
                  'inset-shadow-sm',
                  'inset-shadow-black',
                  'relative',
                  'z-10000',
                  'overflow-auto',
                  'text-white',
                )}
                style={{
                  width: 0,
                  height: height,
                  overflow: 'hidden',
                  ...(active === previousActive
                    ? {
                        height: 'auto',
                        width: 500,
                        transitionDelay: '300ms',
                        transitionDuration: '500ms',
                      }
                    : {}),
                }}
              >
                <div
                  style={{ minWidth: 500 }}
                  className="p-4 absolute top-0 right-0 bottom-0 overflow-auto"
                >
                  <div className="text-sm font-bold">コメント</div>
                  <ul>
                    {(a.comments?.edges ?? []).map((e) => {
                      if (e.node) {
                        return (
                          <div key={e.node.id} className={classnames('m-4')}>
                            <div className="flex flex-row items-center gap-4">
                              <div className="font-bold">
                                @{e.node.user?.name}
                              </div>
                              <div className="text-xs opacity-50 flex items-center justify-center">
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
          opacity: dialogFragment ? 0 : 1,
        }}
        href={href}
      >
        <div
          style={{ width, height, minWidth: width }}
          onClick={() => {
            syncDimensions();
          }}
        >
          {cardFragment}
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
