'use client';

import { HomeScreen, ActiveVideo, Category, Rect } from '@/lib/types';
import { type FC, useEffect, useCallback } from 'react';
import VideoThumbnail from './video-thumbnail';
import Link from 'next/link';
import { useRef, useState } from 'react';
import VideoOverlay from './video-overlay';

export interface VideoCardProps {
  value: Exclude<HomeScreen['videos'], undefined | null>[number];
  href: string;
  active?: ActiveVideo;
  category: Category;
  onClose: () => void;
  animate?: boolean;
  height: number;
  width: number;
}

/**
 * A component for rendering a video card.  It also includes the functionality to show a detail view.
 * @param props.value - The configuration for the display of the card
 * @param props.href - The link url for when the card it clicked.
 * @param props.active - The modal shown when the card is open.
 * @param props.category - The category containing the video
 */
const VideoCard: FC<VideoCardProps> = (props) => {
  const { value, onClose, active, href, height, width } = props;
  const ref = useRef<HTMLAnchorElement>(null);

  const [sourceRect, setSourceRect] = useState<Rect | null>(null);
  const [overlayActive, setOverlayActive] = useState<ActiveVideo | null>(null);
  const syncSourceRect = useCallback(() => {
    if (ref.current) {
      const { top, left, right, bottom, width, height } =
        ref.current.getBoundingClientRect();

      if (
        !sourceRect ||
        top !== sourceRect.top ||
        bottom !== sourceRect.bottom ||
        left !== sourceRect.left ||
        right !== sourceRect.right ||
        width !== sourceRect.width ||
        height !== sourceRect.height
      ) {
        setSourceRect({ top, left, right, bottom, width, height });
      }
    }
  }, [sourceRect, setSourceRect]);

  useEffect(() => {
    if (overlayActive !== active && active) {
      setTimeout(() => {
        syncSourceRect();
        setOverlayActive(active);
      }, 100);
    }
  }, [active, setOverlayActive, overlayActive, syncSourceRect]);

  return (
    <>
      {sourceRect && overlayActive ? (
        <VideoOverlay
          value={active || overlayActive}
          onClose={() => {
            syncSourceRect();
            onClose();
          }}
          open={active === overlayActive}
          animate={true}
          sourceRect={sourceRect}
        />
      ) : null}
      <Link
        key={value.id}
        ref={(node) => {
          ref.current = node;

          // Record the position once rendered
          syncSourceRect();

          return () => {
            ref.current = null;
          };
        }}
        title={value.title ?? ''}
        style={{
          width,
          height,
          minWidth: width,
          ...(active
            ? {
                // Give time for the floating image to be rendered before hiding the current one
                opacity: 0,
                transition: 'opacity 0s 100ms',
              }
            : {
                // Reshow after the close transtion finishes
                opacity: 1,
                transition: 'opacity 0s 500ms',
              }),
        }}
        href={href}
      >
        <div
          style={{ width, height, minWidth: width }}
          onClick={() => {
            syncSourceRect();
          }}
        >
          <VideoThumbnail
            value={value}
            width={width}
            height={height}
            loading={Boolean(active)}
            interactive={true}
            animate={true}
          />
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
