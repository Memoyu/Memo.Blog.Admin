import { FC, useEffect, useState } from 'react';
import {
    Button,
    Input,
    List,
    Modal,
    Popconfirm,
    Space,
    Toast,
    Typography,
} from '@douyinfe/semi-ui';

import MdEditor from '@src/components/md-editor';
import ListEmpty from '@src/components/list-empty';

import {
    articleTemplateCreate,
    articleTemplateDelete,
    articleTemplateList,
    articleTemplateUpdate,
} from '@src/utils/request';

import { ArticleTemplateModel } from '@src/common/model';

import './index.scss';

interface ComProps {
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onOk?: (content: string) => void;
}

const { Text } = Typography;

const Index: FC<ComProps> = ({ visible, onVisibleChange, onOk }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
    const [templates, setTemplates] = useState<Array<ArticleTemplateModel>>();

    const [currentTemplate, setCurrentTemplate] = useState<ArticleTemplateModel>();
    const [content, setContent] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [templateNameVisible, setTemplateNameVisible] = useState<boolean>(false);
    const [createTemplateName, setCeateTemplateName] = useState<string>('');

    // 获取模板列表
    let getTemplateList = () => {
        setTemplatesLoading(true);

        articleTemplateList()
            .then((res) => {
                if (!res.isSuccess) return;
                setTemplates(res.data ? res.data : []);
            })
            .finally(() => setTemplatesLoading(false));
    };

    // modal显示/隐藏
    const handleModalVisibleChange = (visible: boolean = false) => {
        setModalVisible(visible);
        onVisibleChange && onVisibleChange(visible);
    };

    // modal 使用模板 点击
    const handleUsingTemplateOkClick = () => {
        if (currentTemplate == undefined) {
            Toast.warning('请选择需要使用的模板！');
            return;
        }

        if (currentTemplate.content != content || currentTemplate.name != name) {
            Toast.warning('已修改模板，先保存在使用吧！');
            return;
        }

        handleUsingTemplateContent(content);
    };

    const handleUsingTemplateContent = (content: string) => {
        if (content.length < 1) {
            Toast.warning('选择的模板内容为空！');
            return;
        }

        handleModalVisibleChange();
        onOk && onOk(content);
    };

    // 创建模板
    const handleCreateTemplateClick = () => {
        articleTemplateCreate({ name: createTemplateName }).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            Toast.success('新增模板成功！');
            setTemplateNameVisible(false);
            getTemplateList();
        });
    };

    // 保存模板
    const handleSaveTemplateClick = () => {
        if (currentTemplate == undefined) {
            Toast.warning('请编辑模板后再保存！');
            return;
        }

        if (name.length < 1) {
            Toast.warning('模板名称不能为空！');
            return;
        }

        if (content.length < 1) {
            Toast.warning('模板内容不能为空！');
            return;
        }

        articleTemplateUpdate({ templateId: currentTemplate.templateId, name, content }).then(
            (res) => {
                if (!res.isSuccess) {
                    Toast.error(res.message);
                    return;
                }

                Toast.success('保存成功');
                setTemplates((old) => {
                    if (!old) return [];
                    old.map((i) => {
                        if (i.templateId == currentTemplate.templateId) {
                            i.name = name;
                            i.content = content;
                        }
                    });
                    return [...old];
                });
            }
        );
    };

    // 删除模板
    const handleDeleteTemplateClick = (templateId: string) => {
        articleTemplateDelete(templateId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            clearCurrentTemplate();
            setTemplates((old) => {
                if (!old) return [];
                let index = old.findIndex((i) => i.templateId == templateId);
                if (index < 0) return old;
                old.splice(index, 1);
                return [...old];
            });
        });
    };

    // 选中模板
    const handleSelectTemplateClick = (template: ArticleTemplateModel) => {
        setContent(template.content);
        setName(template.name);
        setCurrentTemplate(template);
    };

    // 双击模板
    const handleTemplateDoubleClick = (template: ArticleTemplateModel) => {
        handleUsingTemplateContent(template.content);
    };

    // 清除选中模板
    const clearCurrentTemplate = () => {
        setContent('');
        setName('');
        setCurrentTemplate(undefined);
    };

    useEffect(() => {
        setModalVisible(visible ?? false);
        getTemplateList();

        return () => {
            setModalVisible(false);
            setTemplateNameVisible(false);
            clearCurrentTemplate();
        };
    }, [visible]);

    return (
        <Modal
            title="文章模板"
            visible={modalVisible}
            onOk={handleUsingTemplateOkClick}
            onCancel={() => {
                handleModalVisibleChange();
            }}
            centered
            bodyStyle={{ margin: '0 15px', padding: 0 }}
            style={{ width: 1200 }}
            okText={'使用模板'}
        >
            <div className="article-template-wrap">
                <div className="article-template-list">
                    <Space spacing="medium" className="template-func">
                        <Popconfirm
                            trigger="custom"
                            visible={templateNameVisible}
                            onCancel={() => setTemplateNameVisible(false)}
                            onConfirm={() => handleCreateTemplateClick()}
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
                        >
                            <Button onClick={() => setTemplateNameVisible(true)}>新增模板</Button>
                        </Popconfirm>
                        <Button onClick={() => handleSaveTemplateClick()}>保存模板</Button>
                    </Space>
                    <div className="template-list">
                        <List
                            loading={templatesLoading}
                            dataSource={templates}
                            emptyContent={<ListEmpty />}
                            split={false}
                            renderItem={(item) => (
                                <List.Item
                                    className="template-list-item"
                                    style={{
                                        padding: 5,
                                        backgroundColor:
                                            item.templateId == currentTemplate?.templateId
                                                ? 'rgba(var(--semi-grey-1))'
                                                : '',
                                    }}
                                    main={
                                        <div
                                            className="template-item-main"
                                            onClick={() => handleSelectTemplateClick(item)}
                                            onDoubleClick={() => handleTemplateDoubleClick(item)}
                                        >
                                            <Text
                                                strong
                                                ellipsis
                                                style={{ cursor: 'pointer', width: 210 }}
                                            >
                                                {item.name}
                                            </Text>
                                            <Popconfirm
                                                position="left"
                                                title="确定是否要删除此模板？"
                                                onConfirm={() =>
                                                    handleDeleteTemplateClick(item.templateId)
                                                }
                                            >
                                                <Button
                                                    onClick={(e) => e.stopPropagation()}
                                                    theme="borderless"
                                                    type="danger"
                                                    size="small"
                                                >
                                                    删除
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    }
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="article-template-preview">
                    <div className="template-info">
                        <Input
                            maxLength={20}
                            value={name}
                            onChange={setName}
                            placeholder="模板名称"
                        />
                    </div>
                    <MdEditor
                        imgPath="articles/template"
                        // height={800}
                        content={content}
                        onChange={setContent}
                        onSave={() => handleSaveTemplateClick()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default Index;
