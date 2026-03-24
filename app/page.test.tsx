// Mock navigation in nestjs
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
}));

// Mock use becuase it makes the test freeze
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(() => ({ categoryVideoId: [] })),
}));

import type { HomeScreen } from '@/lib/types';
import {
  GetHomeScreensDocument,
  GetOriginalVideoDocument,
  GetVideoCommentsDocument,
} from '@/lib/graphql/generated/graphql';
import '@testing-library/jest-dom';
import { MockedProvider, MockedProviderProps } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';

const result: { data: { homeScreens: HomeScreen[] } } = {
  data: {
    homeScreens: [
      {
        id: '121',
        category: {
          id: '63',
          name: 'SAMANSAの定番作品',
          __typename: 'Category',
        },
        videos: [
          {
            id: '2033',
            title: '空いている部屋',
            duration: {
              minutes: 18,
              seconds: 34,
              __typename: 'Duration',
            },
            landscapeThumbnail:
              'https://d8cip8330xdjp.cloudfront.net/translations/thumbnails/9381/Room_Taken_JPH(2).jpg',
            __typename: 'OriginalVideo',
          },
        ],
        __typename: 'HomeScreen',
      },
    ],
  },
};

const mocks: MockedProviderProps['mocks'] = [
  { request: { query: GetHomeScreensDocument }, result },
  { request: { query: GetOriginalVideoDocument }, result },
  { request: { query: GetVideoCommentsDocument }, result },
];

describe('Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('renders a heading', async () => {
    const Page = (await import('./page')).default;
    render(
      <MockedProvider mocks={mocks}>
        <Page searchParams={Promise.resolve({})} />
      </MockedProvider>,
    );

    await expect(screen.findByText('18:34')).resolves.toBeInTheDocument();
    await expect(screen.findByText("空いている部屋")).resolves.toBeInTheDocument();
  });
});
