// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { ArticleDetail } from './data';

/** 获取文章详情 GET /api/article */
export async function articleDetail(params: { id: number }, options?: { [key: string]: any }) {
  return request<{
    data: ArticleDetail;
    success?: boolean;
  }>('/api/article', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
