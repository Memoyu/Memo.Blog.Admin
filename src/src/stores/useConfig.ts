import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { AdminVisitorModel } from '@src/common/model';
import { visitorConfigGet, visitorConfigUpdate } from '@src/utils/request';
import { Toast } from '@douyinfe/semi-ui';

interface ConfigState {
    visitor: AdminVisitorModel;
    init: () => void;
    setVisitor: (visitor: string) => void;
}

const useConfigStore = createWithEqualityFn<ConfigState>()(
    persist(
        (set) => ({
            visitor: { visitorId: '' },
            init: () => {
                visitorConfigGet().then((res) => {
                    if (res.isSuccess && res.data != undefined) {
                        set({ visitor: res.data });
                    }
                });
            },
            setVisitor: (visitorId: string) => {
                visitorConfigUpdate({ visitorId }).then((res) => {
                    if (!res.isSuccess || !res.data) {
                        Toast.error('保存默认访客失败');
                        return;
                    }
                    set({ visitor: res.data });
                    Toast.success('保存默认访客成功');
                });
            },
        }),
        {
            name: 'config-visitor-store',
        }
    )
);

export default useConfigStore;
