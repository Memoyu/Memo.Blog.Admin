// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { ArticleItem, ArticleListParams } from './data';

/** 获取文章列表 GET /api/article/list */
export async function article(params: ArticleListParams, options?: { [key: string]: any }) {
  return request<{
    data: ArticleItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/article/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
