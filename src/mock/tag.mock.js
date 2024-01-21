module.exports = {
  'GET /api/tag/group/list': {
    data: [
      {
        id: 8213123140,
        name: '后端',
        tags: [
          { id: 123, name: '.NET' },
          { id: 124, name: 'Java' },
          { id: 125, name: 'Golang' },
        ],
        status: 0,
        updatedAt: '2022-12-06T05:00:57.040Z',
        createdAt: '2022-12-06T05:00:57.040Z',
      },
      {
        id: 8213123141,
        name: '前端',
        tags: [
          { id: 123, name: 'Vue' },
          { id: 125, name: 'React' },
        ],
        status: 1,
        updatedAt: '2022-12-06T05:00:57.040Z',
        createdAt: '2022-12-06T05:00:57.040Z',
      },
      {
        id: 8213123142,
        name: '运维',
        tags: [
          { id: 123, name: 'Docker' },
          { id: 125, name: 'Linux' },
          { id: 126, name: 'K8s' },
        ],
        status: 1,
        updatedAt: '2022-12-06T05:00:57.040Z',
        createdAt: '2022-12-06T05:00:57.040Z',
      },
      {
        id: 8213123143,
        name: '云原生',
        tags: [],
        status: 0,
        updatedAt: '2022-12-06T05:00:57.040Z',
        createdAt: '2022-12-06T05:00:57.040Z',
      },
    ],
    total: 10,
    success: true,
    pageSize: 20,
    pageIndex: 1,
  },
};
