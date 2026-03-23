import Link from 'next/link';
import Image from 'next/image';
import type { FC, ReactNode } from 'react';

const Header: FC<{ children?: ReactNode }> = ({ children = null }) => {
  return (
    <div className="flex flex-row items-center gap-4 pb-4 pt-8 px-4 justify-start">
      <h1 className="branding text-[24px] font-bold align-middle flex flex-row items-center justify-center">
        <Link href="/" className="hover:underline">
          <Image
            width={120}
            height={24}
            className="dark:hidden block"
            src="/samansa-logo-light.svg"
            alt="Samansa"
          />
          <Image
            width={120}
            height={24}
            className="hidden dark:block"
            src="/samansa-logo-dark.svg"
            alt="Samansa"
          />
        </Link>
      </h1>
      {children}
    </div>
  );
};

export default Header;
