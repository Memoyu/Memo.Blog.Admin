// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { PostDetail } from './data';

/** 获取文章详情 GET /api/post */
export async function postDetail(params: { id: number }, options?: { [key: string]: any }) {
  return request<{
    data: PostDetail;
    success?: boolean;
  }>('/api/post', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
