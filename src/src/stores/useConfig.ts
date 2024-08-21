import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { AdminVisitorModel } from '@src/common/model';
import { visitorConfigGet } from '@src/utils/request';

interface ConfigState {
    visitor: AdminVisitorModel;
    init: () => void;
    setVisitor: (visitor: AdminVisitorModel) => void;
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
            setVisitor: (visitor: AdminVisitorModel) => {
                set({ visitor: visitor });
                // TODO 更新配置
            },
        }),
        {
            name: 'config-store',
        }
    )
);

export default useConfigStore;
