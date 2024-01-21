import { request } from 'umi';
import { CategoryItem, CategoryListParams } from './data';

/** 获取分类列表 GET /api/category/list */
export async function category(params: CategoryListParams, options?: { [key: string]: any }) {
  return request<{
    data: CategoryItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/category/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
