"use client";

import { NextPage } from 'next';

type Repo = {
  data: {
    name: string
    stargazers_count: number
  }
}

const Page: NextPage<{data : Repo }> = () => {
  return null;
};

export default Page;
