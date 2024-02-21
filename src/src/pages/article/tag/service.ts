import { request } from 'umi';
import { TagGroupItem, TagGroupListParams } from './data';

/** 获取分类列表 GET /api/tag/group/list */
export async function tag(params: TagGroupListParams, options?: { [key: string]: any }) {
  return request<{
    data: TagGroupItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/tag/group/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
