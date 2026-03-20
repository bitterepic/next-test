'use client';

import { type OriginalVideo } from '@/lib/graphql/generated/graphql';
import { type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';

const VideoCard: FC<{
  value: Pick<OriginalVideo, 'id' | 'landscapeThumbnail' | 'title'|'duration'>;
}> = (props) => {
  const width = 320;
  const height = 180;
  const gradientHeight = 600;
  const {
    value: { id, landscapeThumbnail, title, duration },
  } = props;
  return (
    <Link
      key={id}
      style={{width, height, minWidth: width}}
      className={classnames(
        'video',
        'bg-neutral-100',
        'relative',
        'z-0',
        'rounded-md',
        'block',
        'overflow-hidden',
        'shadow-lg/100',
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
      <div className="info-caption z-2 absolute bottom-0 left-0 right-0 p-1 pointer-events-none flex flex-row align-start justify-start items-start" >
        <div>{/*title*/}</div>
        <div className="flex-1" style={{flex: 1}}></div>
        <div className="flex flex-row">
        <Image src="/clock.svg" width="16" height="16" alt="時間" className="invert"></Image>
        <div className="duration">{duration.minutes}:{String(duration.seconds).padStart(2, "0")}</div>
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
