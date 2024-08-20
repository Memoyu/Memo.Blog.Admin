import { FC, useEffect, useState } from 'react';

import './index.scss';
import { AdminConfigModel, AdminVisitorModel, VisitorPageRequest } from '@src/common/model';
import { Avatar, Select, Toast } from '@douyinfe/semi-ui';
import { visitorPage } from '@src/utils/request';
import { debounce } from 'lodash';

interface ComProps {
    admin: AdminConfigModel | undefined;
    onVisitorChange?: (admin: AdminVisitorModel) => void;
}

const Index: FC<ComProps> = ({ admin, onVisitorChange }) => {
    const [visitorId, setVisitorId] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const [visitors, setVisitors] = useState<Array<AdminVisitorModel>>();

    useEffect(() => {
        console.log(admin?.visitor);
        if (admin?.visitor && admin.visitor.visitorId.length > 0) {
            let v = { ...admin.visitor };
            console.log('回显了', v);
            setVisitors([v]);
            setVisitorId(v.visitorId);
        }
    }, [admin?.visitor]);

    const handleSearch = (val: string) => {
        let request = { nickname: val, page: 1, size: 20 } as VisitorPageRequest;
        visitorPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setVisitors(
                    res.data.items.map((v) => {
                        return {
                            visitorId: v.visitorId,
                            avatar: v.avatar,
                            nickname: v.nickname,
                        };
                    })
                );
            })
            .finally(() => setLoading(false));
    };

    const handleSelectChange = (visitorId: any) => {
        let visitor = visitors?.filter((v) => v.visitorId == visitorId)[0];
        console.log('选项变更', visitorId, visitor);
        if (!visitor) return;
        setVisitorId(visitorId);
        onVisitorChange && onVisitorChange(visitor);
    };

    const renderOptionItemWithVisitor = (item: AdminVisitorModel) => {
        return (
            <Select.Option value={item.visitorId} showTick={true} {...item} key={item.visitorId}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                    <Avatar size="small" src={item.avatar} />
                    <div style={{ marginLeft: 10 }}> {item.nickname}</div>
                </div>
            </Select.Option>
        );
    };

    const renderSelectedItemWithVisitor = (item: any) => {
        console.log('选项选中', item);
        let content = (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                <Avatar size="extra-small" src={item.avatar} />
                <div style={{ marginLeft: 10 }}> {item.nickname}</div>
            </div>
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
                defaultValue={'9297675229724677'}
                value={visitorId}
                onSearch={debounce(handleSearch, 800)}
                loading={loading}
                emptyContent={null}
                onChange={handleSelectChange}
                renderSelectedItem={renderSelectedItemWithVisitor}
            >
                {visitors?.map((item) => renderOptionItemWithVisitor(item))}
            </Select>
        </div>
    );
};

export default Index;
