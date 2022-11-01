import axios from 'axios';
import React, { useState } from 'react';
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
import { useCatcher } from '../../hooks/useCatcher';

const registrationSchema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
  email: yup.string().email('Insira um email válido').required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  passwordConfirmation: yup
    .string()
    .required('Campo obrigatório')
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais'),
});

interface ICreateUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const defaultValue = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
} as ICreateUser;

const Registration: React.FunctionComponent = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues] = useState(defaultValue as ICreateUser);

  const navigate = useNavigate();
  const { catcher } = useCatcher();

  async function registrationHandler(values: ICreateUser): Promise<void> {
    setLoader(true);
    const { name, email, password, passwordConfirmation } = values;

    await UsersService.create({ name, email, password, passwordConfirmation })
      .then(() => {
        toastMsg(ToastType.Success, 'Cadastrado com sucesso!');
        navigate('/', { replace: true });
      })
      .catch((error) => {
        if (axios.isAxiosError(error) !== undefined) {
          catcher('createUser', error);
        }
      });

    setLoader(false);
  }
  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            Cadastro
          </Text>
          <Formik
            initialValues={initialValues}
            validationSchema={registrationSchema}
            enableReinitialize
            onSubmit={async (values) => {
              await registrationHandler(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Col md={6} className="mb-3">
                  <Input
                    cy="test-inputName"
                    id="name"
                    name="name"
                    as="input"
                    type="string"
                    label="Nome"
                    isInvalid={(errors.name && touched.name) || false}
                    msg={errors.name}
                    placeholder="Nome"
                  />
                </Col>

                <Col md={6} className="mb-3">
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

                <Col md={6} className="mb-3">
                  <Input
                    cy="test-inputPasswordConfirmation"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    as="input"
                    type="password"
                    label="Confirmar senha"
                    isInvalid={(errors.passwordConfirmation && touched.passwordConfirmation) || false}
                    msg={errors.passwordConfirmation}
                    placeholder="Senha"
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Button type="submit" variant="primary" disabled={loader} cy="test-buttonRegistration">
                    Cadastrar-se
                  </Button>
                </Col>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Section>
  );
};

export default Registration;
