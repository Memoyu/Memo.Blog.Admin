import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { IconChangelog } from '@douyinfe/semi-icons-lab';
import {
    Form,
    Typography,
    Switch,
    Row,
    Col,
    Button,
    Input,
    Space,
    Toast,
    Popconfirm,
    Modal,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import UploadImage from '@src/components/upload-image';
import MdEditor from '@src/components/md-editor';
import TemplateList from './components/template-list';

import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { ArticleEditRequest, ArticleModel, ArticleStatus } from '@src/common/model';

import {
    articleGet,
    articleCreate,
    articleUpdate,
    articleCategoryList,
    articleTagList,
    articleTemplateCreate,
} from '@src/utils/request';

import './index.scss';

const { Section, Select, TextArea } = Form;
const { Title, Text } = Typography;

const Index: React.FC = () => {
    const formRef = useRef<Form>(null);
    const params = useParams();

    const [articleId, setArticleId] = useState<string>();
    const [article, setArticle] = useState<ArticleModel>();
    const [articleBanner, setArticleBanner] = useState<string>();
    const [articleContent, setArticleContent] = useState<string>('');
    const [articleStatus, setArticleStatus] = useState<ArticleStatus>();
    const [isTop, setIsTop] = useState<boolean>(false);
    const [commentable, setCommentable] = useState<boolean>(true);
    const [publicable, setPublicable] = useState<boolean>(true);
    const [categories, setCategories] = useState<Array<OptionProps>>();
    const [tags, setTags] = useState<Array<OptionProps>>();

    const [templateVisible, setTemplateVisible] = useState<boolean>(false);
    const [templateNameVisible, setTemplateNameVisible] = useState<boolean>(false);
    const [createTemplateName, setCeateTemplateName] = useState<string>('');
    const [coverConfirmVisible, setCoverConfirmVisible] = useState<boolean>(false);
    const [templateContent, setTemplateContent] = useState<string>('');
    // 获取文章详情
    let getArticleDetail = async (id: string) => {
        let res = await articleGet(id);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return;
        }

        let article = res.data;
        setArticle(article);
        setArticleStatus(article.status);
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
        let res = await articleCategoryList();
        setCategories(
            res.data?.map((c) => {
                return { value: c.categoryId, label: c.name };
            })
        );

        return res.data;
    };

    // 获取标签列表
    let getTags = async () => {
        let res = await articleTagList();

        setTags(
            res.data?.map((c) => {
                return { value: c.tagId, label: c.name };
            })
        );
        return res.data;
    };

    // 点击保存/发布
    let handleSaveArticle = (msg: string = '', status?: ArticleStatus) => {
        let formApi = formRef.current?.formApi;
        formApi
            ?.validate()
            .then(async (form) => {
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
                }
                if (!res.isSuccess) {
                    Toast.error(res.message);
                    return;
                }

                setArticleId(res.data);
                if (status != undefined) {
                    setArticleStatus(status);
                }
                Toast.success('文章保存' + msg + '成功');

                // 停留在编辑页面
                // navigate('/article');
            })
            .catch((err) => {
                let keys = Object.keys(err);
                Toast.error(err[keys[0]]);
            });
    };

    const handleCategoryFocus = async () => {
        let categories = await getCategories();

        let formApi = formRef.current?.formApi;
        let selCategoryId: string = formApi?.getValue('categoryId');
        // console.log('已选中', selCategoryId);
        let index = categories?.findIndex((c) => selCategoryId == c.categoryId);
        if (!index || index < 0) {
            formApi?.setValue('categoryId', '');
        }
    };

    const handleTagFocus = async () => {
        let tags = await getTags();

        let filterIds: Array<string> = [];
        let formApi = formRef.current?.formApi;
        let selTags: Array<string> = formApi?.getValue('tags');
        // console.log('已选中', selTags);

        if (selTags && selTags.length > 0) {
            selTags.map((s) => {
                let index = tags?.findIndex((p) => p.tagId == s);
                index && index > -1 && filterIds.push(s);
            });
        }

        formApi?.setValue('tags', filterIds);
    };

    // 触发使用模板内容替换现有内容
    const handleUsingTemplateClick = (content: string) => {
        // 内容不为空时，进行弹窗确认，确认则替换
        if (articleContent.length > 0) {
            setTemplateContent(content);
            setCoverConfirmVisible(true);
            return;
        }

        setArticleContent(content);
    };

    // 触发覆盖当前内容
    const handleCoverContentOk = () => {
        setArticleContent(templateContent);
        setCoverConfirmVisible(false);
    };

    // 触发存为模板
    const handleSaveTemplateClick = () => {
        if (articleContent.length < 1) {
            Toast.warning('请填写文章内容再保存为模板！');
            return;
        }

        setTemplateNameVisible(true);
    };

    // 触发创建文章模板
    const handleCreateTemplateClick = () => {
        if (createTemplateName.length < 1) {
            Toast.warning('请填写模板名称！');
            return;
        }

        articleTemplateCreate({ name: createTemplateName, content: articleContent }).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('存为模板成功！');
            setTemplateNameVisible(false);
        });
    };

    useOnMountUnsafe(() => {
        getCategories();
        getTags();

        var articleId = params.id;
        if (articleId) {
            setArticleId(articleId);
            getArticleDetail(articleId);
        }
    });

    return (
        <Content title="文章编辑" icon={<IconChangelog />}>
            <div className="edit-container">
                <Form ref={formRef} initValues={article}>
                    <Section text={'基本信息'}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Input
                                    field="title"
                                    label="标题"
                                    trigger="blur"
                                    rules={[
                                        { required: true, message: '文章标题必填' },
                                        { max: 50, message: '长度不能超50个字符' },
                                    ]}
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
                                        { max: 500, message: '长度不能超500个字符' },
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
                <Section
                    className="content-editer"
                    text={
                        <Space spacing="medium" align="center">
                            <Title heading={5}>文章内容</Title>{' '}
                            <Button theme="borderless" onClick={() => setTemplateVisible(true)}>
                                文章模板
                            </Button>
                            <Popconfirm
                                trigger="custom"
                                visible={templateNameVisible}
                                onCancel={() => setTemplateNameVisible(false)}
                                showCloseIcon={false}
                                title={null}
                                icon={null}
                                content={
                                    <div style={{ width: 300 }}>
                                        <Input
                                            maxLength={20}
                                            onChange={setCeateTemplateName}
                                            placeholder="模板名称"
                                        />
                                    </div>
                                }
                                onConfirm={() => handleCreateTemplateClick()}
                            >
                                <Button
                                    theme="borderless"
                                    onClick={() => handleSaveTemplateClick()}
                                >
                                    存为模板
                                </Button>
                            </Popconfirm>
                        </Space>
                    }
                >
                    <MdEditor
                        imgPath="articles/content"
                        height={800}
                        content={articleContent}
                        onChange={setArticleContent}
                        onSave={() => handleSaveArticle()}
                    />
                </Section>
                <Space style={{ margin: 20, width: '100%' }}>
                    <Button
                        type="primary"
                        theme="solid"
                        style={{ width: 120, marginRight: 4 }}
                        onClick={() => handleSaveArticle()}
                    >
                        保存
                    </Button>
                    {articleStatus != ArticleStatus.Draft && (
                        <Button onClick={() => handleSaveArticle('草稿', ArticleStatus.Draft)}>
                            存为草稿
                        </Button>
                    )}
                    {articleStatus != ArticleStatus.Published && (
                        <Button onClick={() => handleSaveArticle('发布', ArticleStatus.Published)}>
                            发布
                        </Button>
                    )}
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
            <TemplateList
                visible={templateVisible}
                onVisibleChange={setTemplateVisible}
                onOk={handleUsingTemplateClick}
            />
            <Modal
                title="覆盖当前内容"
                visible={coverConfirmVisible}
                onOk={handleCoverContentOk}
                onCancel={() => setCoverConfirmVisible(false)}
                maskClosable={false}
                centered
            >
                文章内容不为空，确定要覆盖吗？
            </Modal>
        </Content>
    );
};

export default Index;
