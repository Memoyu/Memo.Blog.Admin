import React, { useState, useRef, useEffect } from 'react';
import { MdEditor } from 'md-editor-rt';
import { Form, Typography, Switch, Row, Col, Button, Space, Toast } from '@douyinfe/semi-ui';
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
import { useNavigate } from 'react-router';
import './index.scss';
import 'md-editor-rt/lib/style.css';
import { ArticleEditRequest, ArticleModel, ArticleStatus } from '@src/common/model';
import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';

const { Section, Input, Select, TextArea } = Form;
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

    const navigate = useNavigate();

    const formRef = useRef<Form>(null);
    const params = useParams();

    const [saveBtnText, setSaveBtnText] = useState<string>('发布');
    const [articleId, setArticleId] = useState<string>();
    const [article, setArticle] = useState<ArticleModel>();
    const [articleContent, setArticleContent] = useState<string>('');
    const [isTop, setIsTop] = useState<boolean>(false);
    const [commentable, setCommentable] = useState<boolean>(true);
    const [publicable, setPublicable] = useState<boolean>(true);
    const [categories, setCategories] = useState<Array<OptionProps>>();
    const [tags, setTags] = useState<Array<OptionProps>>();

    // 获取文章详情
    let getArticleDetail = async (id: string) => {
        let res = await articleGet(id);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        let article = res.data;
        setArticle(article);
        let formApi = formRef.current?.formApi;
        article &&
            formApi?.setValues({
                ...article,
                categoryId: article.category.categoryId,
                tags: article.tags.map((t) => t.tagId),
            });
        setArticleContent(article?.content as string);
        setIsTop(article?.isTop as boolean);
        setCommentable(article?.commentable as boolean);
        setPublicable(article?.publicable as boolean);
    };

    // 获取分类列表
    let getCategories = async () => {
        let res = await articleCategoryList();
        setCategories(
            res.data?.map((c) => {
                return { value: c.categoryId, label: c.name };
            })
        );
    };

    // 获取标签列表
    let getTags = async () => {
        let res = await articleTagList();
        setTags(
            res.data?.map((c) => {
                return { value: c.tagId, label: c.name };
            })
        );
    };

    // 点击保存/发布
    let handleSaveArticle = (status: ArticleStatus) => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (form) => {
            let article = form as ArticleEditRequest;
            article.status = status;
            article.content = articleContent;
            article.isTop = isTop;
            article.commentable = commentable;
            article.publicable = publicable;
            //TODO: 暂时赋默认值
            article.banner = '3333';
            console.log(article);

            let res;
            if (articleId) {
                // 更新
                article.articleId = articleId;
                res = await articleUpdate(article);
            } else {
                // 新增
                res = await articleCreate(article);
            }
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success(saveBtnText + '文章成功');

            navigate('/article');
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
                <Space style={{ margin: 20, width: '100%' }}>
                    <Button
                        type="primary"
                        theme="solid"
                        style={{ width: 120, marginRight: 4 }}
                        onClick={() => handleSaveArticle(ArticleStatus.Published)}
                    >
                        {saveBtnText}
                    </Button>
                    <Button onClick={() => handleSaveArticle(ArticleStatus.Draft)}>
                        保存到草稿
                    </Button>
                    <Space style={{ marginLeft: 60 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ margin: 8 }}>置顶</Text>
                            <Switch checked={isTop} onChange={setIsTop} aria-label="置顶" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ margin: 8 }}>评论</Text>
                            <Switch
                                checked={commentable}
                                onChange={setCommentable}
                                aria-label="评论"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ margin: 8 }}>公开</Text>
                            <Switch
                                checked={publicable}
                                onChange={setPublicable}
                                aria-label="公开"
                            />
                        </div>
                    </Space>
                </Space>
            </div>
        </Content>
    );
};

export default Index;
