import { FC, useEffect, useRef, useState } from 'react';
import {
    Button,
    Space,
    Typography,
    Modal,
    Form,
    Toast,
    Row,
    Col,
    Input,
    List,
    Card,
    Descriptions,
} from '@douyinfe/semi-ui';

import UploadImage from '@src/components/upload-image';

import { useData } from '@src/hooks/useData';

import { GitHubRepoPageModel, OpenSourceEditRequest, OpenSourceModel } from '@src/common/model';

import {
    openSourceCreate,
    openSourceUpdate,
    openSourceGet,
    githubRepoPage,
} from '@src/utils/request';

import './index.scss';

const { Text, Title } = Typography;

interface Iprops {
    projectId?: string;
    title?: string;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onOk?: () => void;
}

const Index: FC<Iprops> = ({ projectId, visible, title, onVisibleChange, onOk }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const formRef = useRef<Form>(null);
    const [editProject, setEditProject] = useState<OpenSourceModel>();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [repoId, setRepoId] = useState<number>();
    const [repoFullName, setRepoFullName] = useState<string>('');

    const [gitHubRepos, gitHubRepoLoading, setGitHubRepos, setGitHubRepoLoading] =
        useData<Array<GitHubRepoPageModel>>();
    const searchKeyWordRef = useRef<string>('');
    const gitHubRepoPageRef = useRef<number>(1);
    const gitHubRepoNoMoreRef = useRef<boolean>(true);

    // 获取GitHub开源源项目分页列表
    let getGitHubRepoPage = async (init: boolean = false) => {
        setGitHubRepoLoading(true);

        if (init) {
            gitHubRepoPageRef.current = 1;
            gitHubRepoNoMoreRef.current = true;
        }

        githubRepoPage({
            keyword: searchKeyWordRef.current,
            page: gitHubRepoPageRef.current,
            size: 15,
        })
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                let items = init ? res.data.items : [...(gitHubRepos ?? []), ...res.data.items];
                setGitHubRepos(items);

                gitHubRepoNoMoreRef.current = items.length >= res.data.total;
            })
            .finally(() => setGitHubRepoLoading(false));
    };

    useEffect(() => {
        setModalVisible(visible ?? false);
        if (visible) initEditOpenSource(projectId);

        return () => {
            setEditProject(undefined);
            setImageUrl('');
            setRepoId(undefined);
            setRepoFullName('');
        };
    }, [projectId, visible, title]);

    // 编辑/新增开源项目
    const initEditOpenSource = async (projectId?: string) => {
        getGitHubRepoPage(true);

        if (projectId) {
            let res = await openSourceGet(projectId);
            if (!res.isSuccess || !res.data) {
                Toast.error(res.message);
                return;
            }

            let project = res.data;
            setImageUrl(project.imageUrl);
            setRepoId(project.repoId);
            setRepoFullName(project.repoFullName);
            setEditProject(project);
            let formApi = formRef.current?.formApi;
            formApi?.setValues({
                ...project,
            });
        }
    };

    // 保存编辑/新增开源项目
    const handleEditModalOk = () => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (form) => {
            let project = {
                ...form,
                projectId,
                repoId,
                imageUrl,
            } as OpenSourceEditRequest;

            var msg = '';
            var res;
            if (projectId) {
                res = await openSourceUpdate(project);
                msg = '更新成功';
            } else {
                res = await openSourceCreate(project);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            handleChangeModalVisible();
            Toast.success(msg);
            onOk && onOk();
        });
    };

    const handleChangeModalVisible = (visible: boolean = false) => {
        setModalVisible(visible);
        onVisibleChange && onVisibleChange(visible);
    };

    const handleSelectedGitHubRepo = (item: GitHubRepoPageModel) => {
        let formApi = formRef.current?.formApi;

        formApi?.setValue('title', item.name);
        formApi?.setValue('description', item.description);
        formApi?.setValue(
            'readmeUrl',
            `https://raw.githubusercontent.com/${item.fullName}/main/README.md`
        );

        setRepoId(item.id);
        setRepoFullName(item.fullName);
    };

    const loadMore =
        !gitHubRepoLoading && !gitHubRepoNoMoreRef.current ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button
                    onClick={() => {
                        gitHubRepoPageRef.current += 1;
                        getGitHubRepoPage();
                    }}
                >
                    显示更多
                </Button>
            </div>
        ) : null;

    return (
        <div className="open-source-edit-modal">
            <Modal
                title={title}
                visible={modalVisible}
                onOk={handleEditModalOk}
                onCancel={() => {
                    handleChangeModalVisible();
                }}
                centered
                bodyStyle={{ height: 650 }}
                style={{ width: 1000 }}
                okText={'保存'}
            >
                <Form
                    ref={formRef}
                    labelPosition="left"
                    labelAlign="left"
                    labelWidth={80}
                    initValues={editProject}
                >
                    <Row gutter={16} type="flex" justify="space-around" align="middle">
                        <Col span={3}>
                            <Form.Slot noLabel>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <UploadImage
                                        type="image"
                                        url={imageUrl}
                                        path="page/about/banner"
                                        onSuccess={setImageUrl}
                                    />
                                </div>
                            </Form.Slot>
                        </Col>
                        <Col span={10}>
                            <Form.Input
                                field="title"
                                label="项目"
                                rules={[{ required: true, message: '项目名称必填' }]}
                            />
                            <Form.Input field="readmeUrl" label="ReadmeUrl" />
                        </Col>
                        <Col span={10}>
                            <Form.TextArea
                                field="description"
                                label="描述"
                                placeholder="请填项目描述"
                                rules={[
                                    { required: true, message: '项目描述必填' },
                                    { max: 100, message: '长度不能超100个字符' },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Form.Section
                        text={
                            <div style={{ display: 'flex', alignItems: 'end' }}>
                                <Title heading={5}>关联源项目</Title>
                                <div style={{ marginLeft: 20 }}>
                                    <Text strong type="warning">
                                        已关联：
                                    </Text>
                                    <Text strong type="success">
                                        {repoFullName}
                                    </Text>
                                </div>
                            </div>
                        }
                    >
                        <Space spacing="loose" style={{ marginBottom: 10 }}>
                            <Input
                                prefix="关键字"
                                onChange={(val) => (searchKeyWordRef.current = val)}
                                onEnterPress={() => getGitHubRepoPage(true)}
                            />
                            <Button type="primary" onClick={() => getGitHubRepoPage(true)}>
                                查询
                            </Button>
                        </Space>
                        <div className="github-repo-modal-list">
                            <List
                                split={false}
                                loading={gitHubRepoLoading}
                                loadMore={loadMore}
                                dataSource={gitHubRepos}
                                renderItem={(item: GitHubRepoPageModel) => (
                                    <List.Item
                                        align="stretch"
                                        style={{ width: '100%' }}
                                        main={
                                            <Card
                                                shadows="hover"
                                                style={{}}
                                                bodyStyle={{
                                                    padding: '8px 15px',
                                                    width: '100%',
                                                }}
                                            >
                                                <div onClick={() => handleSelectedGitHubRepo(item)}>
                                                    <Descriptions
                                                        layout="horizontal"
                                                        align="plain"
                                                        column={2}
                                                    >
                                                        <Descriptions.Item itemKey="项目">
                                                            <Title heading={6}>
                                                                {item.fullName}
                                                            </Title>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item itemKey="状态">
                                                            <Text
                                                                type={
                                                                    item.private
                                                                        ? 'danger'
                                                                        : 'success'
                                                                }
                                                            >
                                                                {item.private ? '私有' : '公开'}
                                                            </Text>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <Descriptions>
                                                        <Descriptions.Item itemKey="标签">
                                                            {item.topics.join(', ')}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <Descriptions align="plain">
                                                        <Descriptions.Item itemKey="描述">
                                                            {item.description}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </div>
                                            </Card>
                                        }
                                    />
                                )}
                            />
                        </div>
                    </Form.Section>
                </Form>
            </Modal>
        </div>
    );
};

export default Index;
