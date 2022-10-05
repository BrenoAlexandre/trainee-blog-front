import React from 'react';
import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { routes } from './routes';
import { useAuth } from '../contexts/AuthContext';

import Loader from '../components/Loader';

interface IPrivateProps {
  children?: React.ReactNode;
  mustBeAdmin: boolean;
  redirectTo: string;
}

const PrivateRoute = (props: IPrivateProps): React.ReactElement => {
  const { children, mustBeAdmin, redirectTo } = props;
  const { logged, user } = useAuth();

  if (mustBeAdmin && user.role !== 'admin') {
    return <Navigate to={redirectTo} />;
  }
  if (!logged) {
    return <Navigate to={redirectTo} />;
  }

  return <div> {children} </div>;
};

const Routes: React.FunctionComponent = () => {
  const renderRoutes = (): React.ReactNode =>
    routes.map((route) => (
      <Route
        key={route.path}
        element={
          !route.public ? (
            <PrivateRoute mustBeAdmin={route.adminOnly} redirectTo={route.redirectTo}>
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
