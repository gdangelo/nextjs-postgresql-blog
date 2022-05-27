import type { NextPage, GetStaticProps } from 'next';
import type { Post } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';

export const getStaticPaths = async () => {
  const posts = await prisma.post.findMany();

  return {
    paths: posts.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = params?.slug
    ? await prisma.post.findUnique({
        where: {
          slug: params.slug,
        },
      })
    : null;

  if (post) {
    return {
      props: JSON.parse(JSON.stringify(post)),
      revalidate: 1,
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

const Post: NextPage<Post> = props => {
  const [views, setViews] = useState(props?.views ?? 0);

  useEffect(() => {
    if (props?.id) {
      fetch(`/api/posts/${props.id}/views`, {
        method: 'PUT',
      });
      setViews(prev => prev + 1);
    }
  }, [props?.id]);

  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.excerpt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 sm:px-6 py-12 max-w-screen-md mx-auto">
        <Link href="/">
          <a className="inline-flex space-x-1 items-center text-blue-600 hover:underline">
            <ArrowLeftIcon className="mt-px w-4 h-4 shrink-0" />
            <span>Back to home</span>
          </a>
        </Link>

        <h1 className="mt-2 text-3xl font-bold">{props.title}</h1>

        <p className="mt-4 text-gray-500 font-medium">
          <span>
            {props?.createdAt
              ? format(new Date(props.createdAt), 'MMMM d, yyyy')
              : null}
          </span>
          {' - '}
          <span>
            {views ?? 0} view{views > 1 ? 's' : null}
          </span>
        </p>

        <p className="mt-4 text-lg text-gray-700">{props?.content ?? ''}</p>
      </main>
    </div>
  );
};

export default Post;
