import type { NextPage, GetStaticProps } from 'next';
import type { Post } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 sm:px-6 py-12 max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold">Blog</h1>

        <ul className="mt-6 space-y-6">
          {posts.map(post => (
            <li key={post.id}>
              <Link href="#">
                <a className="group block">
                  <p className="text-gray-500 text-sm">
                    {post?.createdAt
                      ? format(new Date(post.createdAt), 'MMMM d, yyyy')
                      : null}
                  </p>
                  <h3 className="text-blue-500 text-xl group-hover:underline underline-offset-1 truncate">
                    {post?.title ?? 'Untitled'}
                  </h3>
                  <p className="text-lg text-gray-800">{post?.excerpt ?? ''}</p>
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
