'use client';

import { type OriginalVideo } from '@/lib/graphql/generated/graphql';
import { type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';

const VideoCard: FC<{
  value: Pick<OriginalVideo, 'id' | 'landscapeThumbnail' | 'title'>;
}> = (props) => {
  const width = 320;
  const height = 180;
  const gradientHeight = 600;
  const {
    value: { id, landscapeThumbnail, title },
  } = props;
  return (
    <Link
      key={id}
      className={classnames(
        'video',
        'bg-neutral-100',
        'relative',
        'z-0',
        `w-[${width}px]`,
        `h-[${height}px]`,
        'rounded-md',
        'block',
        'overflow-hidden',
        'shadow-lg',
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
      <div className="title z-2 absolute bottom-0 left-0 pointer-events-none">
        {title}
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
          'duration-1000',
          'pointer-events-none',
        )}
        style={{ height: `${gradientHeight}px` }}
      ></div>
      <Image
        src={landscapeThumbnail ?? ''}
        className="object-cover object-contain absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none"
        priority={true}
        width="480"
        height="270"
        alt={title ?? ''}
      />
    </Link>
  );
};

export default VideoCard;
