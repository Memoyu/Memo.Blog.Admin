import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Select, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { TagGroupItem, TagItem } from './data';
import s from './index.less';
import { tag } from './service';

const handleAdd = async (fields: TagGroupItem) => {
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

const handleRemove = async (selectedRows: TagGroupItem[]) => {
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

export const PostTag: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TagGroupItem>();
  const [selectedRowsState, setSelectedRows] = useState<TagGroupItem[]>([]);

  const columns: ProColumns<TagGroupItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '分组名称',
      dataIndex: 'name',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (_, group) => (
        <Space size={[1, 4]} wrap>
          {group.tags.map((tag: TagItem) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '已停用',
          status: 'Error',
          disabled: true,
        },
        1: {
          text: '使用中',
          status: 'Success',
        },
      },
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, group) => [
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
      <ProTable<TagGroupItem>
        headerTitle="文章分类"
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
        request={tag}
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
        title="新建标签组"
        width="400px"
        className={s.editModalForm}
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as TagGroupItem);
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
              message: '请输入标签组名称',
            },
          ]}
          width="md"
          name="name"
          placeholder="请输入标签组名称"
        />
        <Select
          mode="tags"
          open={false}
          style={{ width: '100%', height: 100 }}
          //onChange={handleChange}
          tokenSeparators={[',']}
          //options={options}
          placeholder="请输入标签"
        />
      </ModalForm>
    </PageContainer>
  );
};
export default PostTag;
