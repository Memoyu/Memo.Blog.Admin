import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { FriendItem } from './data';
import { friends } from './service';

const handleAdd = async (fields: FriendItem) => {
  const hide = message.loading('正在添加');

  try {
    // await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: FriendItem[]) => {
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

export const Friends: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<FriendItem>();
  const [selectedRowsState, setSelectedRows] = useState<FriendItem[]>([]);

  const columns: ProColumns<FriendItem>[] = [
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
      dataIndex: 'nickname',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '链接',
      dataIndex: 'link',
    },
    {
      title: '访问次数',
      dataIndex: 'views',
    },

    {
      title: '创建时间',
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
      render: (_, friend) => [
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
      <ProTable<FriendItem>
        headerTitle="友链列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={friends}
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
              项 &nbsp;&nbsp;
              <span>服务调用次数总计</span>
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
      <ModalForm
        title="新建分类"
        width="400px"
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as FriendItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入分类名称',
            },
          ]}
          width="md"
          name="name"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Friends;
