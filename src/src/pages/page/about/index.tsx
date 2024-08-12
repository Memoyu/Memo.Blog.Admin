import React, { useState, useRef } from 'react';
import { IconRating } from '@douyinfe/semi-icons-lab';
import { Form, Toast, Row, Col, Button, Space, Switch, Typography } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import MdEditor from '@src/components/md-editor';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

import UploadImage from '@src/components/upload-image';
import { AboutModel } from '@src/common/model';

import { aboutGet, aboutUpdate } from '@src/utils/request';

import './index.scss';

const { Section, Input, TagInput } = Form;
const { Text } = Typography;

const Index: React.FC = () => {
    const formRef = useRef<Form>(null);

    const [about, setAbout] = useState<AboutModel>();
    const [content, setContent] = useState<string>();
    const [banner, setBanner] = useState<string>();
    const [commentable, setCommentable] = useState<boolean>(true);

    // 获取当前关于信息
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
        setContent(about?.content);
        setBanner(about?.banner);
        setCommentable(about?.commentable as boolean);
    };

    useOnMountUnsafe(() => {
        getAbout();
    });

    // 触发保存关于信息
    let handleSaveAbout = () => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (form) => {
            let about = { ...form, banner, content, commentable } as AboutModel;
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
                            <Col span={16}>
                                <div>
                                    <Input field="title" label="标题" trigger="blur" />
                                    <TagInput
                                        style={{ width: '100%' }}
                                        field="tags"
                                        label="标签"
                                        placeholder="请输个人标签"
                                    />
                                </div>
                            </Col>
                            <Col span={8}>
                                <Form.Slot label={{ text: '头图' }}>
                                    <UploadImage
                                        type="banner"
                                        url={banner}
                                        path="page/about/banner"
                                        onSuccess={setBanner}
                                    />
                                </Form.Slot>
                            </Col>
                        </Row>
                        <Row></Row>
                    </Section>
                </Form>
                <Section className="content-editer" text={'内容'}>
                    <MdEditor
                        imgPath="page/about/content"
                        height={800}
                        content={content}
                        onChange={setContent}
                        onSave={() => handleSaveAbout()}
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
