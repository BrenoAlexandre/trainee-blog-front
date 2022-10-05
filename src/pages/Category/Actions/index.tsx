import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import Section from '../../../components/Section';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import categoryService from '../../../services/category.service';

const createSchema = yup.object().shape({
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
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);

  async function submitHandler(values: ICreate): Promise<void> {
    try {
      const { title } = values;
      setLoader(true);

      await categoryService.postCategory(title);
      toastMsg(ToastType.Success, 'Categoria criada com sucesso!');

      setLoader(false);
      navigate('/home');
    } catch (error) {
      setLoader(false);
      toastMsg(ToastType.Error, (error as Error).message);
    }
  }

  return (
    <Section className="create" title="Criar categoria" description="Criar categoria">
      <Row className="mb-5">
        <Col md={12}>
          <Text as="h1" size="2rem" weight={700}>
            Criar categoria
          </Text>
        </Col>
      </Row>
      <Formik
        initialValues={defaultValue}
        validationSchema={createSchema}
        enableReinitialize
        onSubmit={(values) => submitHandler(values)}
      >
        {({ errors, touched }) => (
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
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                      Criar publicação
                    </Button>
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
