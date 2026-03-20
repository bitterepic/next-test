/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query getCategory($id: ID!) {\n  category(id: $id) {\n    id\n    name\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}": typeof types.GetCategoryDocument,
    "query getHomeScreens {\n  homeScreens {\n    id\n    category {\n      id\n      name\n    }\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}": typeof types.GetHomeScreensDocument,
    "query getOriginalVideo($id: ID!) {\n  originalVideo(id: $id) {\n    title\n    id\n    description\n    landscapeThumbnail\n    likeNum\n    duration {\n      minutes\n      seconds\n    }\n  }\n}": typeof types.GetOriginalVideoDocument,
    "query getVideoComments($id: ID!, $first: Int, $after: String) {\n  videoComments(id: $id, first: $first, after: $after) {\n    id\n    allCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n      hasPreviousPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        contents\n        user {\n          id\n          name\n          avatar\n        }\n        createdAt\n        likeNum\n      }\n    }\n  }\n}": typeof types.GetVideoCommentsDocument,
};
const documents: Documents = {
    "query getCategory($id: ID!) {\n  category(id: $id) {\n    id\n    name\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}": types.GetCategoryDocument,
    "query getHomeScreens {\n  homeScreens {\n    id\n    category {\n      id\n      name\n    }\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}": types.GetHomeScreensDocument,
    "query getOriginalVideo($id: ID!) {\n  originalVideo(id: $id) {\n    title\n    id\n    description\n    landscapeThumbnail\n    likeNum\n    duration {\n      minutes\n      seconds\n    }\n  }\n}": types.GetOriginalVideoDocument,
    "query getVideoComments($id: ID!, $first: Int, $after: String) {\n  videoComments(id: $id, first: $first, after: $after) {\n    id\n    allCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n      hasPreviousPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        contents\n        user {\n          id\n          name\n          avatar\n        }\n        createdAt\n        likeNum\n      }\n    }\n  }\n}": types.GetVideoCommentsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getCategory($id: ID!) {\n  category(id: $id) {\n    id\n    name\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}"): (typeof documents)["query getCategory($id: ID!) {\n  category(id: $id) {\n    id\n    name\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getHomeScreens {\n  homeScreens {\n    id\n    category {\n      id\n      name\n    }\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}"): (typeof documents)["query getHomeScreens {\n  homeScreens {\n    id\n    category {\n      id\n      name\n    }\n    videos {\n      id\n      title\n      duration {\n        minutes\n        seconds\n      }\n      landscapeThumbnail\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getOriginalVideo($id: ID!) {\n  originalVideo(id: $id) {\n    title\n    id\n    description\n    landscapeThumbnail\n    likeNum\n    duration {\n      minutes\n      seconds\n    }\n  }\n}"): (typeof documents)["query getOriginalVideo($id: ID!) {\n  originalVideo(id: $id) {\n    title\n    id\n    description\n    landscapeThumbnail\n    likeNum\n    duration {\n      minutes\n      seconds\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getVideoComments($id: ID!, $first: Int, $after: String) {\n  videoComments(id: $id, first: $first, after: $after) {\n    id\n    allCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n      hasPreviousPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        contents\n        user {\n          id\n          name\n          avatar\n        }\n        createdAt\n        likeNum\n      }\n    }\n  }\n}"): (typeof documents)["query getVideoComments($id: ID!, $first: Int, $after: String) {\n  videoComments(id: $id, first: $first, after: $after) {\n    id\n    allCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n      hasPreviousPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        contents\n        user {\n          id\n          name\n          avatar\n        }\n        createdAt\n        likeNum\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;