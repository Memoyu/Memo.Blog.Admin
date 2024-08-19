import { FC, useEffect, useState } from 'react';

import './index.scss';
import { AdminConfigModel, VisitorPageRequest } from '@src/common/model';
import { Avatar, Select, Tag, Toast, Typography } from '@douyinfe/semi-ui';
import { visitorPage } from '@src/utils/request';
import { debounce } from 'lodash';
import { OptionProps, optionRenderProps } from '@douyinfe/semi-ui/lib/es/select';

interface ComProps {
    admin: AdminConfigModel | undefined;
    onChange?: (admin: AdminConfigModel) => void;
}

const Index: FC<ComProps> = ({ admin, onChange }) => {
    const [visitor, setVisitor] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const [visitors, setVisitors] = useState<Array<OptionProps>>();

    const [adminConfig, setAdminConfig] = useState<AdminConfigModel>();

    useEffect(() => {
        setAdminConfig(admin);
    }, [admin]);

    const handleSearch = (val: string) => {
        let request = { nickname: val, page: 1, size: 20 } as VisitorPageRequest;
        visitorPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }
                let options = res.data.items.map((v) => {
                    return {
                        value: v.visitorId,
                        label: v.nickname.length < 1 ? '未知' : v.nickname,
                        avatar: v.avatar,
                    };
                });
                setVisitors(options);
            })
            .finally(() => setLoading(false));
    };

    const handleSelectChange = (val: string) => {
        let ac = adminConfig ? adminConfig : { visitorId: val };
        setVisitor(val);
        onChange && onChange(ac);
    };

    const renderOptionItemWithVisitor = (renderProps: optionRenderProps) => {
        const { disabled, selected, label, value, avatar, focused, onMouseEnter, onClick } =
            renderProps;

        let cls =
            'semi-select-option' +
            (focused ? ' semi-select-option-focused' : '') +
            (disabled ? ' semi-select-option-disabled' : '') +
            (selected ? ' semi-select-option-selected' : '');

        return (
            <div
                style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}
                className={cls}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                <Avatar size="small" src={avatar} />
                <div style={{ marginLeft: 10 }}> {label}</div>
            </div>
        );
    };

    const renderSelectItemWithVisitor = (optionNode: Record<string, any>) => {
        let content = (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                <Avatar size="extra-small" src={optionNode.avatar} />
                <div style={{ marginLeft: 10 }}> {optionNode.label}</div>
            </div>
        );
        return content;
    };

    (optionNode: Record<string, any>) => {
        const content = (
            <Tag avatarSrc={optionNode.avatar} avatarShape="circle" closable={true} size="large">
                {optionNode.label}
            </Tag>
        );

        return content;
    };

    return (
        <div className="admin-config">
            <div>管理回复评论默认访客：</div>
            <Select
                style={{ marginTop: 5, width: 300 }}
                filter
                remote
                onChangeWithObject
                value={visitor}
                onSearch={debounce(handleSearch, 1000)}
                optionList={visitors}
                loading={loading}
                emptyContent={null}
                onChange={(s) => handleSelectChange(s as string)}
                renderOptionItem={renderOptionItemWithVisitor}
                renderSelectedItem={renderSelectItemWithVisitor}
            />
        </div>
    );
};

export default Index;
