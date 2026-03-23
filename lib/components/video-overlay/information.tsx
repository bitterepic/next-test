import type { FC, CSSProperties } from 'react';
import Image from 'next/image';
import Duration from '@/lib/components/duration';
import type { Video } from '@/lib/types';

interface InformationProps {
  value: Video;
  className?: string,
  style?: CSSProperties
}

const Information: FC<InformationProps> = (props) => {
  const { value, className, style } = props;

  if (!value) return null;

  return (
    <div
      className={className}
      style={style}
    >
      <dl>
        <dd className="my-4 text-xl font-bold">{value.title}</dd>
        <dd className="mb-4 text-md">{value.description}</dd>
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
              {value.likeNum}
            </dd>
          </div>
          <div>
            <dd className="mb-4 text-md flex flex-row gap-1">
              <Duration value={value.duration} />
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
};
export default Information;
