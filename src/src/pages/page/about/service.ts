// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { AboutDetail } from './data';

/** 获取文章详情 GET /api/about */
export async function aboutDetail(params: {}, options?: { [key: string]: any }) {
  return request<{
    data: AboutDetail;
    success?: boolean;
  }>('/api/about', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
