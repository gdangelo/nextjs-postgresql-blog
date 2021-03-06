import type { NextPage, GetStaticProps } from 'next';
import type { Post } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const getStaticPaths = async () => {
  const posts = await prisma.post.findMany();

  return {
    paths: posts.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

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
  const router = useRouter();

  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    (async () => {
      // Update views count
      const { data: post } = await axios.put<Post>(
        `/api/posts/${props.id}/views`
      );
      // Set state
      setViews(post?.views ?? 0);
      setLikes(post?.likes ?? 0);
    })();
  }, [props.id]);

  const likePost = () => {
    axios.put(`/api/posts/${props.id}/likes`);
    setLikes(prev => prev + 1);
  };

  if (router.isFallback) {
    return (
      <div className="px-4 sm:px-6 h-screen w-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.excerpt} />
      </Head>

      <main className="px-4 sm:px-6 py-16 max-w-screen-md mx-auto">
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
            {Intl.NumberFormat().format(views)} view
            {views > 1 ? 's' : null}
          </span>
        </p>

        <button
          type="button"
          onClick={likePost}
          className="mt-1 inline-flex items-center space-x-1 font-medium group"
        >
          <HeartIcon className="w-5 h-5 text-red-500 shrink-0 group-hover:scale-125 transition" />
          <span className="text-gray-500 hover:text-current transition">
            {Intl.NumberFormat().format(likes)}
          </span>
        </button>

        <p className="mt-4 text-lg text-gray-700">{props?.content ?? ''}</p>
      </main>
    </div>
  );
};

export default Post;
