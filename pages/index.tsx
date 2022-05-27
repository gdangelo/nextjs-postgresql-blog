import type { NextPage, GetStaticProps } from 'next';
import type { Post } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { HeartIcon } from '@heroicons/react/solid';

export const getStaticProps: GetStaticProps = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
    revalidate: 1,
  };
};

interface HomeProps {
  posts: Post[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Blog App</title>
        <meta
          name="description"
          content="Blog app created with Next.js + Prisma + PostgreSQl"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 sm:px-6 py-16 max-w-screen-md mx-auto">
        <div className="flex items-center justify-between space-x-4">
          <h1 className="text-3xl font-bold">Blog</h1>

          <div>
            <Link href="/new">
              <a className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50">
                Create post
              </a>
            </Link>
          </div>
        </div>

        <ul className="mt-8 space-y-6">
          {posts.map(post => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`}>
                <a className="group block">
                  <div className="flex items-center space-x-1 text-gray-500 text-sm font-medium">
                    <span>
                      {post?.createdAt
                        ? format(new Date(post.createdAt), 'MMMM d, yyyy')
                        : null}
                    </span>
                    <span>-</span>
                    <span>
                      {Intl.NumberFormat().format(post?.views ?? 0)} view
                      {post?.views > 1 ? 's' : null}
                    </span>
                    <span>-</span>
                    <div className="inline-flex items-center space-x-1">
                      <HeartIcon className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{Intl.NumberFormat().format(post?.likes)}</span>
                    </div>
                  </div>
                  <h3 className="text-blue-600 text-xl group-hover:underline underline-offset-1 truncate">
                    {post?.title ?? 'Untitled'}
                  </h3>
                  <p className="text-lg text-gray-700">{post?.excerpt ?? ''}</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
