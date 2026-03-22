import Link from 'next/link';
import Image from 'next/image';
import type { FC } from 'react';

const Header: FC<Record<string, never>> = () => {
  return (
    <div className="flex flex-row items-center gap-8 py-4 px-4">
      <h1 className="branding text-[24px] font-bold align-middle">
        <Link href="/" className="hover:underline">
          <Image
            width={120}
            height={24}
            className="dark:collapse visible"
            src="/samansa-logo-light.svg"
            alt="Samansa"
          />
          <Image
            width={120}
            height={24}
            className="collapse dark:visible"
            src="/samansa-logo-dark.svg"
            alt="Samansa"
          />
        </Link>
      </h1>
    </div>
  );
};

export default Header;
