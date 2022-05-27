// @ts-check
import http from 'k6/http';
import { check, fail, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

const GetPostsTrend = new Trend('Get latest posts', true);
const CreatePostTrend = new Trend('Create post', true);
const ViewPostTrend = new Trend('View post', true);
const LikePostTrend = new Trend('Like post', true);

export const options = {
  vus: 1000,
  duration: '10s',
};

const SLEEP_DURATION = 0.5;

const baseUrl = `https://${__ENV.API_URL}/api`;

export default function () {
  group('user flow', function () {
    // Get latest posts
    const getPostsRes = http.get(`${baseUrl}/posts`);
    check(getPostsRes, {
      'Status 200 - Get posts': r => r.status === 200,
    });

    sleep(SLEEP_DURATION);

    // Create a new post
    let createPostRes = http.post(`${baseUrl}/posts`, {
      title: 'Post from load testing',
      excerpt: 'Test',
      content: 'Test',
    });
    check(createPostRes, {
      'Status 200 - Create post': r => r.status == 200,
    });
    const createdPostId = JSON.parse(String(createPostRes.body)).id;

    sleep(SLEEP_DURATION);

    // View new post
    let viewPostRes = http.put(`${baseUrl}/posts/${createdPostId}/views`);
    check(viewPostRes, {
      'Status 200 - View Post': r => r.status == 200,
    });

    // Like new post
    let likePostRes = http.put(`${baseUrl}/posts/${createdPostId}/likes`);
    check(likePostRes, {
      'Status 200 - Like Post': r => r.status == 200,
    });

    GetPostsTrend.add(getPostsRes.timings.duration);
    CreatePostTrend.add(createPostRes.timings.duration);
    ViewPostTrend.add(viewPostRes.timings.duration);
    LikePostTrend.add(likePostRes.timings.duration);
  });
}
