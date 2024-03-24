import React, { useEffect, useState, useRef } from 'react';
import { MdEditor } from 'md-editor-rt';
import { IconRating } from '@douyinfe/semi-icons-lab';
import { Form, Toast, Row, Col, Button, Space, Switch, Typography } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';

import './index.scss';
import 'md-editor-rt/lib/style.css';
import { aboutGet, aboutUpdate } from '@src/utils/request';
import { AboutModel } from '@src/common/model';

const { Section, Input, TagInput } = Form;
const { Text } = Typography;

const Index: React.FC = () => {
    const toolbars: Array<any> = [
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
    ];

    const formRef = useRef<Form>(null);

    const [about, setAbout] = useState<AboutModel>();
    const [content, setContent] = useState<string>('');
    const [commentable, setCommentable] = useState<boolean>(true);

    let getAbout = async () => {
        let res = await aboutGet();
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        let about = res.data;
        setAbout(about);
        let formApi = formRef.current?.formApi;
        about &&
            formApi?.setValues({
                ...about,
            });
        setContent(about?.content as string);
        setCommentable(about?.commentable as boolean);
    };

    useEffect(() => {
        getAbout();
    }, []);

    let handleSaveAbout = () => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (form) => {
            let about = { ...form, content, commentable } as AboutModel;
            let res = await aboutUpdate(about);

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('保存关于信息成功');
        });
    };

    return (
        <Content title="关于信息" icon={<IconRating />}>
            <div className="about-container">
                <Form ref={formRef} initValues={about}>
                    <Section text={'基本信息'}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Input field="title" label="标题" trigger="blur" />
                            </Col>
                            <Col span={8}>
                                <TagInput field="tags" label="标签" placeholder="请输个人标签" />
                            </Col>
                            <Col span={4}>
                                {/* <Form.Upload
                                    field="banner"
                                    label="头图"
                                    action="//semi.design/api/upload"
                                >
                                    <Button icon={<IconUpload />} theme="light">
                                        文章头图
                                    </Button>
                                </Form.Upload> */}
                            </Col>
                        </Row>
                    </Section>
                </Form>
                <Section className="content-editer" text={'内容'}>
                    <MdEditor
                        style={{ height: 800 }}
                        modelValue={content}
                        toolbars={toolbars}
                        onChange={setContent}
                    />
                </Section>
                <Space style={{ margin: 20, width: '100%' }}>
                    <Button
                        type="primary"
                        theme="solid"
                        style={{ width: 120, marginRight: 4 }}
                        onClick={() => handleSaveAbout()}
                    >
                        保存
                    </Button>

                    <Space style={{ marginLeft: 60 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ margin: 8 }}>评论</Text>
                            <Switch
                                checked={commentable}
                                onChange={setCommentable}
                                aria-label="评论"
                            />
                        </div>
                    </Space>
                </Space>
            </div>
        </Content>
    );
};

export default Index;
