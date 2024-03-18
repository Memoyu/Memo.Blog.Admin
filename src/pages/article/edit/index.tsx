import React, { useState, useRef, useEffect } from 'react';
import { MdEditor } from 'md-editor-rt';
import { Form, Row, Col, Button, Space, Toast } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import { useParams } from 'react-router-dom';
import {
    articleGet,
    articleCreate,
    articleUpdate,
    articleCategoryList,
    articleTagList,
} from '@src/utils/request';

import './index.scss';
import 'md-editor-rt/lib/style.css';
import { ArticleModel } from '@src/common/model';
import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';

const { Section, Input, Select, TextArea, TagInput } = Form;

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
    const params = useParams();

    const [saveBtnText, setSaveBtnText] = useState<string>('发布');
    const [articleId, setArticleId] = useState<string>();
    const [article, setArticle] = useState<ArticleModel>();
    const [articleContent, setArticleContent] = useState<string>('');
    const [categories, setCategories] = useState<Array<OptionProps>>();
    const [tags, setTags] = useState<Array<OptionProps>>();

    // 获取文章详情
    let getArticleDetail = async (id: string) => {
        articleGet(id)
            .then((res) => {
                if (res.isSuccess) {
                    setArticle(res.data);
                    let formApi = formRef.current?.formApi;
                    const article = res.data;
                    article &&
                        formApi?.setValues({
                            ...article,
                            categoryId: article.category.categoryId,
                            tags: article.tags.map((t) => t.tagId),
                        });
                    // setArticleContent(article?.content as string);
                }
            })
            .finally();
    };

    // 获取分类列表
    let getCategories = async () => {
        articleCategoryList().then((res) => {
            return setCategories(
                res.data?.map((c) => {
                    return { value: c.categoryId, label: c.name };
                })
            );
        });
    };

    // 获取标签列表
    let getTags = async () => {
        articleTagList().then((res) => {
            return setTags(
                res.data?.map((c) => {
                    return { value: c.tagId, label: c.name };
                })
            );
        });
    };

    // 点击保存/发布
    let handleSaveArticle = () => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (formData) => {
            let article = formData as ArticleModel;
            article.content = articleContent;
            article.banner = '3333';
            console.log(article);

            if (articleId) {
                // 更新
                article.articleId = articleId;
                articleUpdate(article).then((res) => {
                    if (!res.isSuccess) {
                        Toast.error(res.message);
                        return;
                    }
                    Toast.success(saveBtnText + '文章成功');
                });
            } else {
                // 新增
                articleCreate(article).then((res) => {
                    if (!res.isSuccess) {
                        Toast.error(res.message);
                        return;
                    }
                    Toast.success(saveBtnText + '文章成功');
                });
            }
        });
    };

    useEffect(() => {
        getCategories();
        getTags();

        var articleId = params.id;
        if (articleId) {
            setArticleId(articleId);
            getArticleDetail(articleId);
            setSaveBtnText('保存');
        }
    }, []);

    return (
        <Content title="📋 文章编辑">
            <div className="edit-container">
                <Form ref={formRef} initValues={article}>
                    <Section text={'基本信息'}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Input
                                    field="title"
                                    label="标题"
                                    trigger="blur"
                                    rules={[
                                        { required: true, message: '文章描述必填' },
                                        { max: 50, message: '长度不能超50个字符' },
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                {/* <Form.Upload
                                    // field="banner"
                                    label="头图"
                                    action="//semi.design/api/upload"
                                >
                                    <Button icon={<IconUpload />} theme="light">
                                        文章头图
                                    </Button>
                                </Form.Upload> */}
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Select
                                    style={{ width: '100%' }}
                                    multiple
                                    field="tags"
                                    label="标签"
                                    placeholder="请选文章标签"
                                    optionList={tags}
                                    rules={[{ required: true, message: '文章分类必填' }]}
                                />
                            </Col>
                            <Col span={12}>
                                <Select
                                    field="categoryId"
                                    label="分类"
                                    placeholder="请选文章分类"
                                    optionList={categories}
                                    rules={[{ required: true, message: '文章分类必填' }]}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextArea
                                    style={{ height: 120 }}
                                    field="description"
                                    label="描述"
                                    placeholder="请填文章描述"
                                    rules={[
                                        { required: true, message: '文章描述必填' },
                                        { max: 100, message: '长度不能超100个字符' },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Section>
                </Form>
                <Section className="content-editer" text={'文章内容'}>
                    <MdEditor
                        style={{ height: 800 }}
                        modelValue={articleContent}
                        toolbars={toolbars}
                        onChange={setArticleContent}
                    />
                </Section>
                <Space style={{ margin: 20, width: '100%', justifyContent: 'center' }}>
                    <Button
                        type="primary"
                        theme="solid"
                        style={{ width: 120, marginTop: 12, marginRight: 4 }}
                        onClick={handleSaveArticle}
                    >
                        {saveBtnText}
                    </Button>
                    <Button style={{ marginTop: 12 }}>保存到草稿</Button>
                </Space>
            </div>
        </Content>
    );
};

export default Index;
