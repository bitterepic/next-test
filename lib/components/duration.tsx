import type { FC, CSSProperties } from 'react';
import Image from "next/image";

export interface DurationProps {
  value: Partial<{
    minutes: number | null | undefined;
    seconds: number | null | undefined;
  }>;
  className?: string;
  style?: CSSProperties;
}

/**
 * Shows duration of a video in a human readable format.
 */
const Duration: FC<DurationProps> = ({ value, className, style }) => {
  const { minutes, seconds } = value;
  return (
    <div className="flex flex-row gap-[2px]">
      <Image
        src="/clock.svg"
        width="16"
        height="16"
        alt="再生時間"
        className="invert drop-shadow-sm"
      ></Image>
      <time
        className={className}
        dateTime={`${minutes}m ${seconds}s`}
        style={style}
      >
        {minutes}:{String(seconds).padStart(2, '0')}
      </time>
    </div>
  );
};

export default Duration;
