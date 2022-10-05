import React from 'react';
import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { routes } from './routes';
import { useAuth } from '../contexts/AuthContext';

import Loader from '../components/Loader';

interface IPrivateProps {
  children?: React.ReactNode;
  adminOnly: boolean;
  redirectTo: string;
}

const PrivateRoute = (props: IPrivateProps): React.ReactElement => {
  const { children, adminOnly, redirectTo } = props;
  const { logged, user } = useAuth();

  if (!logged) {
    return <Navigate to={redirectTo} />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

const Routes: React.FunctionComponent = () => {
  const renderRoutes = (): React.ReactNode =>
    routes.map((route) => (
      <Route
        key={route.path}
        element={
          !route.public ? (
            <PrivateRoute adminOnly={route.adminOnly} redirectTo={route.redirectTo}>
              <route.component />
            </PrivateRoute>
          ) : (
            <route.component />
          )
        }
        {...route}
      />
    ));

  return (
    <div className="d-flex">
      <div className="d-flex flex-column p-0 w-100">
        <main>
          <Container fluid>
            <React.Suspense fallback={<Loader />}>
              <Switch>{renderRoutes()}</Switch>
            </React.Suspense>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Routes;
