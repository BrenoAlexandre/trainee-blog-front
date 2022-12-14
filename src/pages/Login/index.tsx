import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import Section from '../../components/Section';
import Text from '../../components/Text';
import Button from '../../components/Button';
import UsersService from '../../services/users.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { setAxiosAuth } from '../../services/httpClient';

const loginSchema = yup.object().shape({
  email: yup.string().email('Insira um email válido').required('Campo obrigatório'),
  password: yup.string().min(6, 'Min. 6 caracteres').required('Campo obrigatório'),
});

interface ILogin {
  email: string;
  password: string;
}

const defaultValue = {
  email: '',
  password: '',
} as ILogin;

const LoginPage: React.FunctionComponent = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues] = useState(defaultValue as ILogin);

  const navigate = useNavigate();
  const { user, logged, Login } = useAuth();

  async function loginHandler(values: ILogin): Promise<void> {
    setLoader(true);
    const { email, password } = values;

    try {
      const response = await UsersService.login(email, password);
      await Login(response).then(() => {
        navigate('/home', { replace: true });
      });

      setAxiosAuth();

      setLoader(false);
    } catch (error) {
      toastMsg(ToastType.Error, 'Usuário incorreto, verifique seus dados.');
      setLoader(false);
    }
  }

  useEffect(() => {
    let isCleaning = false;

    if (!isCleaning) {
      if (user && logged) {
        navigate('/home');
      }
    }

    return () => {
      isCleaning = true;
    };
  }, [logged, navigate, user]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            Login
          </Text>

          <Text as="small" size="1rem" weight={400}>
            Acesse o blog e tenha acesso as publicações!
          </Text>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            enableReinitialize
            onSubmit={async (values) => {
              await loginHandler(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Col md={6} className="mb-3 ">
                  <Input
                    cy="test-inputEmail"
                    id="email"
                    name="email"
                    as="input"
                    type="email"
                    label="Email"
                    isInvalid={(errors.email && touched.email) || false}
                    msg={errors.email}
                    placeholder="Email"
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Input
                    cy="test-inputPassword"
                    id="password"
                    name="password"
                    as="input"
                    type="password"
                    label="Senha"
                    isInvalid={(errors.password && touched.password) || false}
                    msg={errors.password}
                    placeholder="Senha"
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Button type="submit" variant="primary" disabled={loader} cy="test-buttonLogin">
                    Login
                  </Button>
                </Col>
              </Form>
            )}
          </Formik>
          <Text as="span">Ainda não possui uma conta?</Text>
          <Col md={12} className="mb-3">
            <Button
              variant="primary"
              cy="test-buttonRegistration"
              onClick={() => {
                navigate('/register', {});
              }}
            >
              Cadastre-se
            </Button>
          </Col>
        </Col>
      </Row>
    </Section>
  );
};

export default LoginPage;
