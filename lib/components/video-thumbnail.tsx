import type { CSSProperties, FC, Ref } from 'react';
import classnames from 'classnames';
import type { HomeScreen } from '@/lib/types';
import Image from 'next/image';
import Duration from './duration';

/** Props for the VideoThumbnail component. */
interface VideoThumbnailProps {
  /** The video data to show */
  value: Exclude<HomeScreen['videos'], undefined | null>[number];
  /** If the thumbnail should indicate user interaction */
  interactive?: boolean;
  /** If the interactions should animate transitions */
  animate?: boolean;
  /** The hight of the thumbnail */
  height: number;
  /** The width of the thumbnail */
  width: number;
  /** If a spinner should be shown over the thumbnail */
  loading?: boolean;
  style?: CSSProperties;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/** A component for showing an interactive thumbnail. */
const VideoThumbnail: FC<VideoThumbnailProps> = (props) => {
  const {
    value,
    interactive = false,
    loading = false,
    width,
    height,
    animate = false,
    className,
    style = {},
    ref,
  } = props;
  const gradientHeight = 600;

  if (!value) return null;

  const { title, duration, landscapeThumbnail } = value;

  return (
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
        ...(interactive
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
        ...(animate ? ['transition-all'] : []),
        'group',
        className ?? '',
      )}
      style={{
        height,
        width,
        ...style,
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
          ...(interactive
            ? [
                'group-hover:opacity-100',
                'group-focus:opacity-100',
                'group-active:opacity-100',
              ]
            : []),
          ...(animate ? ['transition-all'] : []),
        )}
      >
        <div className="flex-1" style={{ flex: 1 }}></div>
        <div className="bg-black/40 rounded-full px-2 backdrop-blur-lg">
          <Duration value={duration} className="text-white text-shadow-sm" />
        </div>
      </div>
      {loading ? (
        <div className="z-100 absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/20">
          <Image
            src="/spinner.svg"
            width="64"
            loading="eager"
            height="64"
            alt="読み込み中"
            className="invert drop-shadow-sm animate-spin"
          ></Image>
        </div>
      ) : null}
      <div
        className={classnames(
          'gradient',
          'z-2',
          'absolute',
          'left-0',
          'right-0',
          `top-[-600px]`,
          'bg-linear-[25deg,transparent_10%,rgba(255,255,255,.4)_60%,transparent_90%]',
          'transition-none',
          ...(interactive
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
          'z-1',
          'pointer-events-none',
          'bg-cover',
          'bg-no-repeat',
        )}
        ref={ref}
        style={{
          backgroundImage: `url(${JSON.stringify(landscapeThumbnail ?? '')})`,
        }}
      ></div>

      {
        <div
          className={classnames(
            'absolute',
            'top-0',
            'text-black',
            'bg-neutral-400',
            'overflow-hidden',
            'left-0',
            'right-0',
            'bottom-0',
            'z-0',
            'pointer-events-none',
            'flex',
            'items-center',
            'justify-center',
            'text-sm',
            'font-bold',
          )}
        >
          {title}
        </div>
      }
    </div>
  );
};

export default VideoThumbnail;
