import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import { ArticleDetail } from './data';
import s from './index.less';
import { articleDetail } from './service';

const fieldLabels = {
  title: '标题',
  headImg: '头图URL',
  category: '分类',
  tag: '标签',
  desc: '描述',
};

export const ArticleEdit: React.FC = () => {
  const [content, setContent] = useState('');
  const [toolbars] = useState([
    'bold',
    'underline',
    'italic',
    '-',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    'save',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
    'catalog',
  ]);
  useRequest<{ data: ArticleDetail }>(articleDetail, {
    onSuccess: (data) => {
      setContent(data.content);
    },
  });

  return (
    <PageContainer>
      <ProForm
        layout="vertical"
        submitter={{
          render: (props, dom) => {
            return (
              <FooterToolbar style={{ backgroundColor: '#FFFFFF' }}>
                <Button key="rest" onClick={() => props.form?.resetFields()}>
                  重置
                </Button>
                <Button key="submit" onClick={() => props.form?.submit?.()}>
                  保存草稿
                </Button>
                <Button key="submit" onClick={() => props.form?.submit?.()}>
                  发布文章
                </Button>
              </FooterToolbar>
            );
          },
        }}
        // initialValues={{ members: tableData }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Card title="基本信息" className={s.card} bordered={false}>
          <Row gutter={[16, 24]}>
            <Col span={12}>
              <ProFormText
                label={fieldLabels.title}
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
                placeholder="请输入文章标题"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={fieldLabels.headImg}
                name="headImg"
                placeholder="请输入文章头图URL"
              />
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col span={8}>
              <ProFormSelect
                label={fieldLabels.category}
                name="category"
                rules={[{ required: true, message: '请选择文章分类' }]}
                options={[
                  {
                    label: '后端',
                    value: 'xiao',
                  },
                  {
                    label: '前端',
                    value: 'mao',
                  },
                ]}
                mode="tags"
                placeholder="请选择文章分类"
              />
            </Col>
            <Col span={16}>
              <ProFormTreeSelect
                label={fieldLabels.tag}
                name="tag"
                fieldProps={{ multiple: true }}
                rules={[{ required: true, message: '请选择文章标签' }]}
                request={() => {
                  return [
                    {
                      title: 'Node1',
                      value: '0-0',
                      children: [
                        {
                          title: 'Child Node1',
                          value: '0-0-0',
                        },
                      ],
                    },
                    {
                      title: 'Node2',
                      value: '0-1',
                      children: [
                        {
                          title: 'Child Node3',
                          value: '0-1-0',
                        },
                        {
                          title: 'Child Node4',
                          value: '0-1-1',
                        },
                        {
                          title: 'Child Node5',
                          value: '0-1-2',
                        },
                      ],
                    },
                  ];
                }}
                placeholder="请选择文章标签"
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <ProFormTextArea
                name="desc"
                label={fieldLabels.desc}
                rules={[{ required: true, message: '请输入文章描述' }]}
                placeholder="请输入文章描述"
              />
            </Col>
          </Row>
        </Card>
        <Card title="内容" className={s.cardNoPadding} bordered={false}>
          <MdEditor
            style={{ height: 800 }}
            modelValue={content}
            toolbars={toolbars}
            onChange={setContent}
          />
        </Card>
      </ProForm>
    </PageContainer>
  );
};

export default ArticleEdit;
