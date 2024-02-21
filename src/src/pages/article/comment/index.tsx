import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { CommentItem } from './data';
import { comments } from './service';

const handleRemove = async (selectedRows: CommentItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    // await removeRule({
    //   key: selectedRows.map((row) => row.key),
    // });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const PostComment: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<CommentItem[]>([]);

  const columns: ProColumns<CommentItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '头像',
      render: (_, comment) => <Avatar src={comment.avatar} />,
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: 'QQ',
      copyable: true,
      dataIndex: 'qq',
    },
    {
      title: 'Github',
      copyable: true,
      dataIndex: 'github',
    },
    {
      title: '评论内容',
      dataIndex: 'content',
    },
    {
      title: '所属页面',
      render: (_, comment) => <a href={comment?.page?.url}>{comment?.page?.title}</a>,
    },
    {
      title: '发布时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '公开',
      render: (_, comment) => <Switch checked={comment.public} />,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, comment) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            handleModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Button type="link" key="delete" danger>
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CommentItem>
        headerTitle="评论列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        toolBarRender={() => []}
        request={comments}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default PostComment;
