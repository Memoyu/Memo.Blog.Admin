import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { IconChangelog } from '@douyinfe/semi-icons-lab';
import { Form, Typography, Switch, Row, Col, Button, Space, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import UploadImage from '@src/components/upload-image';
import MdEditor from '@src/components/md-editor';

import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { ArticleEditRequest, ArticleModel, ArticleStatus } from '@src/common/model';

import {
    articleGet,
    articleCreate,
    articleUpdate,
    articleCategoryList,
    articleTagList,
} from '@src/utils/request';

import './index.scss';

const { Section, Input, Select, TextArea } = Form;
const { Text } = Typography;

const Index: React.FC = () => {
    // const navigate = useNavigate();

    const formRef = useRef<Form>(null);
    const params = useParams();

    const [saveBtnText, setSaveBtnText] = useState<string>('发布');
    const [articleId, setArticleId] = useState<string>();
    const [article, setArticle] = useState<ArticleModel>();
    const [articleBanner, setArticleBanner] = useState<string>();
    const [articleContent, setArticleContent] = useState<string>('');
    const [isTop, setIsTop] = useState<boolean>(false);
    const [commentable, setCommentable] = useState<boolean>(true);
    const [publicable, setPublicable] = useState<boolean>(true);
    const [categories, setCategories] = useState<Array<OptionProps>>();
    const [tags, setTags] = useState<Array<OptionProps>>();

    // 获取文章详情
    let getArticleDetail = async (id: string) => {
        let res = await articleGet(id);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return;
        }

        let article = res.data;
        setArticle(article);
        let formApi = formRef.current?.formApi;
        article &&
            formApi?.setValues({
                ...article,
                banner: [{ url: article.banner }],
                categoryId: article.category?.categoryId,
                tags: article.tags.map((t) => t.tagId),
            });
        setArticleContent(article?.content as string);
        setArticleBanner(article?.banner);
        setIsTop(article?.isTop as boolean);
        setCommentable(article?.commentable as boolean);
        setPublicable(article?.publicable as boolean);
    };

    // 获取分类列表
    let getCategories = async () => {
        let formApi = formRef.current?.formApi;
        let selCategoryId: string = formApi?.getValue('categoryId');
        // console.log('已选中', selCategoryId);

        let res = await articleCategoryList();
        setCategories(
            res.data?.map((c) => {
                return { value: c.categoryId, label: c.name };
            })
        );
        let index = res.data?.findIndex((c) => selCategoryId == c.categoryId);

        if (!index || index < 0) {
            formApi?.setValue('categoryId', '');
        }
    };

    // 获取标签列表
    let getTags = async () => {
        let formApi = formRef.current?.formApi;
        let selTags: Array<string> = formApi?.getValue('tags');
        // console.log('已选中', selTags);

        let res = await articleTagList();
        let filterIds: Array<string> = [];
        setTags(
            res.data?.map((c) => {
                if (selTags && selTags.length > 0) {
                    let index = selTags.findIndex((p) => p == c.tagId);
                    index > -1 && filterIds.push(c.tagId);
                }

                return { value: c.tagId, label: c.name };
            })
        );

        formApi?.setValue('tags', filterIds);
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
            article.banner = articleBanner ?? '';
            // console.log(article);

            let res;
            if (articleId) {
                // 更新
                article.articleId = articleId;
                res = await articleUpdate(article);
            } else {
                // 新增
                res = await articleCreate(article);
                setArticleId(res.data);
            }
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success(saveBtnText + '文章成功');

            // 停留在编辑页面
            // navigate('/article');
        });
    };

    const handleCategoryFocus = () => {
        // console.log('选中');
        getCategories();
    };

    const handleTagFocus = () => {
        getTags();
    };

    useOnMountUnsafe(() => {
        getCategories();
        getTags();

        var articleId = params.id;
        if (articleId) {
            setArticleId(articleId);
            getArticleDetail(articleId);
            setSaveBtnText('保存');
        }
    });

    return (
        <Content title="文章编辑" icon={<IconChangelog />}>
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
                            <Col span={6}>
                                <Select
                                    showClear
                                    style={{ width: '100%' }}
                                    maxTagCount={3}
                                    multiple
                                    field="tags"
                                    label="标签"
                                    placeholder="请选文章标签"
                                    optionList={tags}
                                    rules={[{ required: true, message: '文章标签必填' }]}
                                    onFocus={() => handleTagFocus()}
                                />
                            </Col>
                            <Col span={6}>
                                <Select
                                    style={{ width: '100%' }}
                                    field="categoryId"
                                    label="分类"
                                    placeholder="请选文章分类"
                                    optionList={categories}
                                    rules={[{ required: true, message: '文章分类必填' }]}
                                    onFocus={() => handleCategoryFocus()}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={16}>
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
                            <Col span={8}>
                                <Form.Slot label={{ text: '头图' }}>
                                    <UploadImage
                                        type="banner"
                                        url={articleBanner}
                                        path="articles/banner"
                                        onSuccess={setArticleBanner}
                                    />
                                </Form.Slot>
                            </Col>
                        </Row>
                    </Section>
                </Form>
                <Section className="content-editer" text={'文章内容'}>
                    <MdEditor
                        imgPath="articles/content"
                        height={800}
                        content={articleContent}
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
