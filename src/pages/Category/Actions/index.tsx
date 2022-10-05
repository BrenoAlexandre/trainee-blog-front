import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/Input';
import Section from '../../../components/Section';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import categoryService from '../../../services/category.service';
import { useAuth } from '../../../contexts/AuthContext';

const createSchema = yup.object().shape({
  title: yup.string().defined('O título é obrigatório').max(100, 'O título deve ter menos de 100 caracteres'),
});

const updateSchema = yup.object().shape({
  title: yup.string().defined('O título é obrigatório').max(100, 'O título deve ter menos de 100 caracteres'),
});

interface ICreate {
  title: string;
  owner: string;
}

const defaultValue = {
  title: '',
  owner: '',
} as ICreate;

const Category: React.FunctionComponent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(defaultValue as ICreate);

  async function submitHandler(values: ICreate): Promise<void> {
    try {
      const { title } = values;
      setLoader(true);

      if (id) {
        await categoryService.updateCategory(id, title);
        toastMsg(ToastType.Success, 'Atualização realizada com sucesso!');
      } else {
        await categoryService.postCategory(title);
        toastMsg(ToastType.Success, 'Categoria criada com sucesso!');
      }

      setLoader(false);
      navigate('/home');
    } catch (error) {
      setLoader(false);
      toastMsg(ToastType.Error, (error as Error).message);
    }
  }

  useEffect(() => {
    async function getCategoryById(): Promise<void> {
      if (id) {
        await categoryService
          .getCategory(id)
          .then((res) => {
            if (res) {
              const obj = {
                title: res.title,
                owner: { id: res.owner.id, name: res.owner.name },
              } as unknown as ICreate;
              setInitialValues(obj);
            }
          })
          .catch((error) => {
            toastMsg(ToastType.Error, (error as Error).message);
          });
      }
    }

    getCategoryById();
  }, [id]);

  return (
    <Section
      className="create"
      title={`${id ? 'Editar' : 'Criar'} categoria`}
      description={`${id ? 'Editar' : 'Criar'} categoria`}
    >
      <Row className="mb-5">
        <Col md={12}>
          <Text as="h1" size="2rem" weight={700}>
            {id ? 'Editar' : 'Criar'} categoria
          </Text>
        </Col>
      </Row>
      <Formik
        initialValues={initialValues}
        validationSchema={!id ? createSchema : updateSchema}
        enableReinitialize
        onSubmit={(values) => submitHandler(values)}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Row>
              <Col md={8}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputTitle"
                      isInvalid={(errors.title && touched.title) || false}
                      msg={errors.title}
                      label="Título"
                      id="title"
                      name="title"
                      as="input"
                      placeholder="Título da categoria"
                      disabled={!!id}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                      {id ? 'Editar' : 'Criar'} publicação
                    </Button>
                    {id && values.owner === user.id && (
                      <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                        Deletar publicação
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

export default Category;
