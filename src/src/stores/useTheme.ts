import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { THEME_MODE } from '@common/constant';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
}

const body = document.body;

const useUserStore = createWithEqualityFn<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (mode: ThemeMode) => {
                if (mode == 'light') {
                    body.removeAttribute(THEME_MODE);
                } else {
                    body.setAttribute(THEME_MODE, mode);
                }

                set({ theme: mode });
            },
        }),
        {
            name: 'theme-store', // name of the item in the storage (must be unique)
        }
    )
);

export default useUserStore;
