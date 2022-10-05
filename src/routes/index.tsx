import React, { useEffect } from 'react';
import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { routes } from './routes';
import { useAuth } from '../contexts/AuthContext';

// components;
import Loader from '../components/Loader';

interface IProps {
  children?: React.ReactNode;
  mustBeAdmin: boolean;
  isPublic: boolean;
  redirectTo?: string;
}

const PrivateRoute = (props: IProps): React.ReactElement => {
  const { children, mustBeAdmin, isPublic, redirectTo } = props;
  const { logged, user } = useAuth();
  let redirectPage;
  useEffect(() => {
    if (!isPublic && !logged) {
      redirectPage = redirectTo ? <Navigate to={redirectTo} /> : <Navigate to="/home" />;
    }
    if (mustBeAdmin && user.role !== 'admin') {
      redirectPage = redirectTo ? <Navigate to={redirectTo} /> : <Navigate to="/home" />;
    }
  }, [logged]);

  return <div> {redirectPage || children} </div>;
};

const Routes: React.FunctionComponent = () => {
  const renderRoutes = (): React.ReactNode =>
    routes.map((route) => (
      <Route
        key={route.path}
        element={
          <PrivateRoute mustBeAdmin={route.adminOnly} isPublic={route.public} redirectTo={route.redirectTo}>
            <route.component />
          </PrivateRoute>
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
