import { request } from 'umi';
import { FriendItem, FriendListParams } from './data';

/** 获取友链列表 GET /api/friend/list */
export async function friends(params: FriendListParams, options?: { [key: string]: any }) {
  return request<{
    data: FriendItem[];
    total?: number;
    success?: boolean;
  }>('/api/friend/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
