import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button';
import Text from '../Text';
import style from './style.module.scss';

interface IProps {
  title: string;
  actionFn: () => void;
  actionText: string;
}

const PageTitle = ({ title, actionFn, actionText }: IProps): React.ReactElement => {
  const { Logout, logged } = useAuth();
  return (
    <Row className="justify-content-space-between">
      <Col sm={6} md={10}>
        <Text as="h1" size="2rem" weight={700}>
          {title}
        </Text>
      </Col>
      <Col sm={6} md={2}>
        {logged ? (
          <div className={style.buttonWrapper}>
            <button type="button" className={style.sessionButton} onClick={Logout}>
              Encerrar sessão
            </button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              variant="secondary"
              className={style.sessionButton}
              cy="test-create"
              onClick={actionFn}
            >
              {actionText}
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

PageTitle.defaultValue = { isLogged: false };
export default PageTitle;
