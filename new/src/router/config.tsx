import { FC, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { PathRouteProps, useLocation } from 'react-router';
import Empty from '@components/empty';

export interface WrapperRouteProps extends PathRouteProps {
    /** document title id */
    titleId: string;
    /** authorization？ */
    auth?: boolean;
}

const PublicRoute = (props: PathRouteProps) => {
    return props.element;
};

const PrivateRoute = (props: PathRouteProps) => {
    const location = useLocation();
    const { pathname } = location;
    // const logged = useStore((state) => state.logged)
    const logged = true; // 这里做登录验证

    return logged ? (
        pathname === '/' ? (
            <Navigate to={{ pathname: `/dashboard` }} replace />
        ) : (
            props.element
        )
    ) : (
        <Empty title="没有权限" description="您还没有登录，请先去登录" type="403" />
    );
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
    const WitchRoute = auth ? PrivateRoute : PublicRoute;
    if (titleId) {
        document.title = titleId;
    }
    return <WitchRoute {...props} />;
};

const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({ titleId, ...props }) => {
    if (titleId) {
        document.title = titleId;
    }

    return <Suspense>{props.element}</Suspense>;
};

export { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent };
