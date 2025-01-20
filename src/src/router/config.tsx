import { FC, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { PathRouteProps, useLocation } from 'react-router';

import useUserStore from '@stores/useUserStore';

export interface WrapperRouteProps extends PathRouteProps {
    /** document title*/
    title: string;
    /** authorization？ */
    auth?: boolean;
}

const PublicRoute = (props: PathRouteProps) => {
    return props.element;
};

const PrivateRoute = (props: PathRouteProps) => {
    const location = useLocation();
    const logged = useUserStore((state) => state.logged);
    const token = useUserStore((state) => state.token);
    var date = new Date();
    let nowTime = date.setMinutes(date.getMinutes() + 5);
    let tokenExpired = token?.expiredAt ?? nowTime;
    // console.log('当前时间戳', new Date().getTime(), tokenExpired);

    const { pathname } = location;

    return logged && nowTime < tokenExpired ? (
        pathname === '/' ? (
            <Navigate to={{ pathname: `/dashboard` }} replace />
        ) : (
            props.element
        )
    ) : (
        <Navigate to={{ pathname: `/login` }} replace />
    );
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ title, auth, ...props }) => {
    const WitchRoute = auth ? PrivateRoute : PublicRoute;
    if (title) {
        document.title = title;
    }
    return <WitchRoute {...props} />;
};

const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({ title, ...props }) => {
    if (title) {
        document.title = title;
    }

    return <Suspense>{props.element}</Suspense>;
};

export { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent };
