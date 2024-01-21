import { request } from 'umi';
import { CommentItem, CommentListParams } from './data';

/** 获取评论列表 GET /api/comment/list */
export async function comments(params: CommentListParams, options?: { [key: string]: any }) {
  return request<{
    data: CommentItem[];
    total?: number;
    success?: boolean;
  }>('/api/comment/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
