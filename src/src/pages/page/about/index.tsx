import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import { AboutDetail } from './data';
import s from './index.less';
import { aboutDetail } from './service';

const aboutLabels = {
  title: '标题',
  headImg: '头图URL',
  desc: '描述',
};

export const About: React.FC = () => {
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
  useRequest<{ data: AboutDetail }>(aboutDetail, {
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
                <Button key="submit" onClick={() => props.form?.submit?.()}>
                  保存
                </Button>
              </FooterToolbar>
            );
          },
        }}
        // initialValues={{ members: tableData }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Card title="关于我" className={s.card} bordered={false}>
          <Row gutter={[16, 24]}>
            <Col span={12}>
              <ProFormText
                label={aboutLabels.title}
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
                placeholder="请输入文章标题"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={aboutLabels.headImg}
                name="headImg"
                placeholder="请输入文章头图URL"
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <ProFormTextArea
                name="desc"
                label={aboutLabels.desc}
                rules={[{ required: true, message: '请输入文章描述' }]}
                placeholder="请输入描述"
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

export default About;
