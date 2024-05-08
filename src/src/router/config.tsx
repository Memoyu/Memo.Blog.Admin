import { FC, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { PathRouteProps, useLocation } from 'react-router';

import { useTypedSelector } from '@src/hooks/useTypedSelector';

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
    const { logged } = useTypedSelector((state) => state.userLogin);
    const { pathname } = location;

    return logged ? (
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
