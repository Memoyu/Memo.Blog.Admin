import { FC, useState } from 'react';

import { Form, Modal, Toast } from '@douyinfe/semi-ui';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { CategoryModel } from '@src/common/model';

import { articleCategoryCreate, articleCategoryUpdate } from '@src/utils/request';

import './index.scss';

interface ComProps {
    title: string;
    visible: boolean;
    category?: CategoryModel;
    onOk?: (name: string) => void;
    onChangeVisible?: (visible: boolean) => void;
}

const Index: FC<ComProps> = ({ title, visible, category, onOk, onChangeVisible }) => {
    const [editForm, setEditForm] = useState<FormApi>();

    // 确认编辑/新增分类
    const handleOk = () => {
        editForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (category) {
                res = await articleCategoryUpdate(category.categoryId, name);
                msg = '更新成功';
            } else {
                res = await articleCategoryCreate(name);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            Toast.success(msg);
            onChangeVisible && onChangeVisible(false);
            onOk && onOk(name);
        });
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            onCancel={() => onChangeVisible && onChangeVisible(false)}
            centered
            bodyStyle={{ height: 100 }}
            okText={'保存'}
        >
            <Form initValues={category} getFormApi={(formData) => setEditForm(formData)}>
                <Form.Input
                    field="name"
                    placeholder="分类名称不超10个字符"
                    label="分类名称"
                    rules={[
                        { required: true, message: '分类名称必填' },
                        { max: 10, message: '长度不能超10个字符' },
                    ]}
                />
            </Form>
        </Modal>
    );
};

export default Index;
