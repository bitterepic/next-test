import type { FC } from 'react';
import Image from "next/image";
import classnames from "classnames";
import type { Comments } from '@/lib/types';

export interface CommentsProps {
  value: Comments;
}

/** A comments component for the VideoOverlay component. */
const Comments: FC<CommentsProps> = (props) => {
  const { value: comments } = props;

  return (
    <>
      <div className="text-sm font-bold">コメント</div>
      <ul>
        {(comments.edges ?? []).map((e) => {
          if (e.node) {
            return (
              <div key={e.node.id} className={classnames('m-4')}>
                <div className="flex flex-row items-center gap-4">
                  <div className="font-bold">@{e.node.user?.name}</div>
                  <div className="text-xs opacity-50 flex items-center justify-center">
                    {new Date(e.node.createdAt).toLocaleDateString()}{' '}
                    {new Date(e.node.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div>{e.node.contents}</div>

                <div className="mb-4 text-md flex flex-row gap-1">
                  <Image
                    src="/thumb-up.svg"
                    width="16"
                    height="16"
                    alt="時間"
                    className="invert drop-shadow-sm"
                  ></Image>
                  {e.node.likeNum}
                </div>
              </div>
            );
          }
          return null;
        })}
      </ul>
    </>
  );
};
export default Comments;
