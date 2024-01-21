// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { PostItem, PostListParams } from './data';

/** 获取文章列表 GET /api/post/list */
export async function post(params: PostListParams, options?: { [key: string]: any }) {
  return request<{
    data: PostItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/post/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
