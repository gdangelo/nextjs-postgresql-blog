import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const NewPostSchema = Yup.object({
  title: Yup.string()
    .max(200, 'Must be 200 characters or less')
    .required('This field is required'),
  excerpt: Yup.string()
    .max(20, 'Must be 500 characters or less')
    .required('This field is required'),
  content: Yup.string().required('This field is required'),
});

const inputClass =
  'w-full shadow-sm rounded-md py-2 px-4 border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed truncate pl-4 border-gray-300 focus:border-blue-400 focus:ring-blue-400';

const labelClass = 'text-gray-600';

const errorClass = 'text-red-500 text-sm';

interface Values {
  title: string;
  excerpt: string;
  content: string;
}

const initialValues: Values = { title: '', excerpt: '', content: '' };

const NewPost: NextPage = () => {
  const router = useRouter();

  const createPost = async (values: Values) => {
    try {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const post = await res.json();
      toast.success('Post successfully created');
      await router.push(`/posts/${post.slug}`);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <Head>
        <title>Create new post</title>
      </Head>

      <main className="px-4 sm:px-6 py-16 max-w-screen-sm mx-auto">
        <h1 className="text-3xl font-bold">Create a new post</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={NewPostSchema}
          onSubmit={createPost}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <label htmlFor="title" className={labelClass}>
                  Title
                </label>
                <Field
                  name="title"
                  disabled={isSubmitting}
                  className={inputClass}
                />
                <ErrorMessage name="title">
                  {msg => <span className={errorClass}>{msg}</span>}
                </ErrorMessage>
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="excerpt" className={labelClass}>
                  Excerpt
                </label>
                <Field
                  name="excerpt"
                  disabled={isSubmitting}
                  className={inputClass}
                />
                <ErrorMessage name="excerpt">
                  {msg => <span className={errorClass}>{msg}</span>}
                </ErrorMessage>
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="content" className={labelClass}>
                  Content
                </label>
                <Field
                  name="content"
                  as="textarea"
                  rows={8}
                  disabled={isSubmitting}
                  className={inputClass}
                />
                <ErrorMessage name="content">
                  {msg => <span className={errorClass}>{msg}</span>}
                </ErrorMessage>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 disabled:opacity-50 diasbled:cursor-not-allowed disabled:bg-blue-600"
                >
                  {isSubmitting ? 'Creating...' : 'Create post'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default NewPost;
