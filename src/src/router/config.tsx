import { FC, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { PathRouteProps, useLocation } from 'react-router';
import Empty from '@components/empty';
import { useTypedSelector } from '@src/hooks/useTypedSelector';

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
