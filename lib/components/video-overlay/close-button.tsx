import classnames from 'classnames';
import type { FC } from 'react';
import Image from "next/image";

export interface CloseButtonProps {
  /** If the dialog should be shown */
  open: boolean;
  /** If the dialog should animate transitions */
  animate: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
}

/** A close button for the VideoOverlay component */
const CloseButton: FC<CloseButtonProps> = (props) => {
  const { onClose, open, animate } = props;
  return (
    <button
      onClick={onClose}
      className={classnames(
        'rounded-full',
        'p-1',
        'bg-black/50',
        'top-2',
        'left-2',
        'z-10',
        'absolute',
        'cursor-pointer',
        ...(animate ? ['transition-all'] : ['transition-none']),
        ...(open ? ['opacity-100'] : ['opacity-0']),
      )}
    >
      <Image
        width={32}
        height={32}
        src="/xmark.svg"
        alt={'閉じる'}
        className="invert dark:invert drop-shadow-lg/50"
      />
    </button>
  );
};

export default CloseButton;
