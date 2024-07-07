/**
 * 防抖方法封装
 *
 * @param fn 目标方法
 * @param ms 防抖延迟
 * @returns
 */
export const debounce = (fn: (...params: Array<any>) => any, ms = 200) => {
    let timer = 0;
    return (...params: Array<any>) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            fn.apply(this, params);
            timer = 0;
        }, ms);
    };
};
