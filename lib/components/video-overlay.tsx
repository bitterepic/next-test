import { type FC, useLayoutEffect, useState, useRef } from 'react';
import Portal from './portal';
import classnames from 'classnames';
import Information from './video-overlay/information';
import Comments from './video-overlay/comments';
import VideoThumbnail from './video-thumbnail';
import type { Rect, ActiveVideo } from '@/lib/types';
import CloseButton from './video-overlay/close-button';
import Backdrop from './video-overlay/backdrop';

export interface VideoOverlayProps {
  value: ActiveVideo;
  /** If the dialog should be shown */
  open: boolean;
  /** If the dialog should animate transitions */
  animate: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
  /** The source rect to transition from */
  sourceRect: Rect;
}

enum State {
  START_CLOSE = 'START_CLOSE',
  CLOSED = 'CLOSED',
  CLOSING = 'CLOSING',
  START_OPEN = 'START_OPEN',
  OPENING = 'OPENING',
  OPENED = 'OPENED',
}

/**
 * A video overlay
 */
const VideoOverlay: FC<VideoOverlayProps> = (props) => {
  const { open, onClose, animate, sourceRect, value } = props;
  const { video, comments } = value;
  const { width, height, left, top } = sourceRect;
  const previewWidth = (width * 4) / 3;
  const previewHeight = (height * 4) / 3;
  const transition = {
    position: 300,
    expand: 200,
  };
  const transitionCountRef = useRef(0);

  const handleOnClose = () => {
    onClose();
  };

  const [state, setState] = useState(State.CLOSED);

  useLayoutEffect(() => {
    if (
      open &&
      [State.CLOSED, State.CLOSING, State.START_CLOSE].includes(state)
    ) {
      setState(State.START_OPEN);
      requestAnimationFrame(() => {
        setState(State.OPENING);
      });
    } else if (
      !open &&
      [State.OPENED, State.OPENING, State.START_OPEN].includes(state)
    ) {
      setState(State.START_CLOSE);
      requestAnimationFrame(() => {
        setState(State.CLOSING);
      });
    }
  }, [open, state]);

  const ifAnimated = (value: string | string[]): string | undefined => {
    if (animate) {
      if (Array.isArray(value)) {
        return value.join(',');
      }
      return value;
    }

    return undefined;
  };

  if (!video || !comments || state === State.CLOSED) return null;

  const cleanupTransitions = () => {
    transitionCountRef.current -= 1;

    if (transitionCountRef.current === 0) {
      if (state === State.CLOSING) {
        setState(State.CLOSED);
      } else if (state === State.OPENING) {
        setState(State.OPENED);
      }
    }
  };

  const openRenderState = [
    State.OPENING,
    State.OPENED,
    State.START_CLOSE,
  ].includes(state);

  return (
    <Portal>
      <Backdrop open={open} onClose={handleOnClose} animate={animate} />

      <div
        className={[
          'ease-in-out',
          'overflow-hidden',
          'flex',
          'flex-row',
          'items-center',
          'justify-center',
          'absolute',
          'z-1000',
        ].join(' ')}
        onTransitionStart={() => {
          transitionCountRef.current += 1;
        }}
        onTransitionCancel={cleanupTransitions}
        onTransitionEnd={cleanupTransitions}
        style={{
          minHeight: height,
          minWidth: width,
          transform: 'translate(-50%, -50%)',
          ...(openRenderState
            ? // When open, center the dialog
              {
                top: '50%',
                left: '50%',
                transition: ifAnimated([
                  `top ${transition.position}ms ease`,
                  `left ${transition.position}ms ease`,
                ]),
              }
            : // When closed, return the thumbnail to the original position
              {
                left: left + width / 2,
                top: top + height / 2,
                transition: ifAnimated([
                  `top ${transition.position}ms`,
                  `left ${transition.position}ms`,
                ]),
              }),
        }}
      >
        <div
          className={classnames(
            'rounded-lg',
            'overflow-hidden',
            'flex',
            'flex-row',
          )}
        >
          <div className="flex flex-col relative">
            <CloseButton
              open={open}
              onClose={handleOnClose}
              animate={animate}
            />

            <div>
              <VideoThumbnail
                value={video}
                width={!openRenderState ? sourceRect.width : previewWidth}
                height={!openRenderState ? sourceRect.height : previewHeight}
                interactive={false}
                animate={true}
              />
            </div>
            <div
              className={classnames('relative')}
              style={{
                ...(openRenderState
                  ? {
                      height: 250,
                      width: previewWidth,
                      transition: ifAnimated([
                        `height ${transition.expand}ms`,
                        `width ${transition.position}ms`,
                      ]),
                      overflow: 'auto',
                    }
                  : {
                      height: 0,
                      width: 0,
                      transition: ifAnimated(`height ${transition.expand}ms`),
                      overflow: 'visible',
                    }),
              }}
            >
              <Information
                value={video}
                className={classnames(
                  'absolute top-0 left-0 right-0 px-4 overflow-visible',
                )}
                style={{ width: previewWidth, minWidth: previewWidth }}
              />
            </div>
          </div>
          <div
            className={classnames(
              'flex-1',
              'relative',
              'z-10000',
              'overflow-auto',
              'text-white',
            )}
            style={{
              overflow: 'hidden',
              ...(openRenderState
                ? {
                    height: 'auto',
                    width: 500,
                    transition: ifAnimated(`width ${transition.expand}ms`),
                  }
                : {
                    width: 0,
                    height: height,
                    transition: ifAnimated(`width ${transition.expand}ms`),
                  }),
            }}
          >
            <div
              style={{ minWidth: 500 - 20 }}
              className={classnames(
                'p-4',
                'absolute',
                'top-0',
                'right-0',
                'bottom-0',
                'overflow-auto',
                'bg-neutral-700/70',
                'rounded-lg',
              )}
            >
              {value.comments ? <Comments value={value.comments} /> : null}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default VideoOverlay;
