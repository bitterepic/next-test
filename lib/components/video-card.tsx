'use client';

import { HomeScreen, ActiveVideo } from '@/lib/types';
import { type FC, type RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import { useRef, useLayoutEffect, useState } from 'react';

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const useDimensions = <T extends RefObject<HTMLElement|null>>(ref: T) : Rect => {
  const [dimensions, setDimensions] = useState<Rect>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useLayoutEffect(() => {
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
  }, [ref, dimensions, setDimensions]);

  return dimensions;
};

const VideoCard: FC<{
  value: Exclude<HomeScreen['videos'], undefined | null>[number];
  active?: ActiveVideo;
  onClose?: () => void;
}> = (props) => {
  const width = 320;
  const height = 180;
  const gradientHeight = 600;
  const ref = useRef<HTMLAnchorElement>(null);
  const dimensions = useDimensions(ref);

  const {
    value: { id, landscapeThumbnail, title, duration },
  } = props;
  return (
    <Link
      key={id}
      ref={ref}
      style={{ width, height, minWidth: width }}
      className={classnames(
        'video',
        'bg-neutral-100',
        'relative',
        'z-0',
        'rounded-md',
        'block',
        'overflow-hidden',
        'shadow-lg/30',
        'hover:scale-110',
        'hover:z-1',
        'active:scale-110',
        'active:z-1',
        'focus:scale-110',
        'focus:z-1',
        'transition-all',
        'group',
      )}
      href={`/videos/${id}`}
    >
      <div className="info-caption z-2 absolute bottom-0 left-0 right-0 p-1 pointer-events-none flex flex-row align-start justify-start items-start opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-all">
        <div>{/*title*/}</div>
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
          'group-hover:transition-all',
          `group-hover:top-[600px]`,
          'group-active:transition-all',
          `group-active:top-[600px]`,
          'group-focus:transition-all',
          `group-focus:top-[600px]`,
          'duration-1000',
          'pointer-events-none',
        )}
        style={{ height: `${gradientHeight}px` }}
      ></div>
      <Image
        src={landscapeThumbnail ?? ''}
        className="object-cover object-contain absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none"
        width={width}
        height={height}
        alt={title ?? ''}
      />
    </Link>
  );
};

export default VideoCard;
