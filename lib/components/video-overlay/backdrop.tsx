import type { FC } from "react";
export interface BackdropProps {
  /** If the dialog should be shown */
  open: boolean;
  /** If the dialog should animate transitions */
  animate: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
}

import classnames from "classnames";

/** A backdrop for the VideoOverlay component */
const Backdrop: FC<BackdropProps> = (props) => {
  const { open, animate, onClose } = props;

  return (
    <div
      className={classnames(
        'absolute',
        'top-0',
        'left-0',
        'right-0',
        'bottom-0',
        ...(open
          ? ['backdrop-blur-sm', 'bg-black/50']
          : ['backdrop-blur-none', 'bg-transparent', 'pointer-events-none']),
        ...(animate ? ['transition-all', 'duration-500'] : ['transition-none']),
      )}
      onClick={onClose}
    ></div>
  );
};

export default Backdrop;
