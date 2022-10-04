import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/Input';
import Section from '../../../components/Section';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import PostService from '../../../services/posts.service';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import { ICategory } from '../../../interfaces';
import categoryService from '../../../services/category.service';

const createSchema = yup.object().shape({
  title: yup.string().defined('O título é obrigatório').max(100, 'O título deve ter menos de 100 caracteres'),
  description: yup.string().defined('A descrição é obrigatória'),
  category: yup.string().defined('A categoria é obrigatória'),
});

const updateSchema = yup.object().shape({
  title: yup.string().defined('O título é obrigatório').max(100, 'O título deve ter menos de 100 caracteres'),
  description: yup.string().defined('A descrição é obrigatória'),
  category: yup.string().defined('A categoria é obrigatória'),
});

interface ICreate {
  title: string;
  description: string;
  category: string;
}

const defaultValue = {
  title: '',
  description: '',
  category: '',
} as ICreate;

const Post: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(defaultValue as ICreate);
  const [categories, setCategories] = useState<ICategory[]>([]);

  async function submitHandler(values: ICreate): Promise<void> {
    try {
      const { title, description, category } = values;
      setLoader(true);

      if (id) {
        await PostService.updatePost(id, title, description);
        toastMsg(ToastType.Success, 'Atualização realizada com sucesso!');
      } else {
        await PostService.publishPost(title, description, category);
        toastMsg(ToastType.Success, 'Cadastro realizado com sucesso!');
      }

      setLoader(false);
      navigate('/home');
    } catch (error) {
      setLoader(false);
      toastMsg(ToastType.Error, (error as Error).message);
    }
  }

  useEffect(() => {
    async function getPostById(): Promise<void> {
      if (id) {
        await PostService.getPost(id)
          .then((res) => {
            if (res) {
              const obj = {
                title: res.title,
                description: res.description,
                category: res.category.id,
              } as ICreate;
              setInitialValues(obj);
            }
          })
          .catch((error) => {
            toastMsg(ToastType.Error, (error as Error).message);
          });
      }
    }
    async function getCategories(): Promise<void> {
      await categoryService
        .getCategories()
        .then((res) => {
          setCategories(res);
        })
        .catch((error) => {
          toastMsg(ToastType.Error, (error as Error).message);
        });
    }

    getPostById();
    getCategories();
  }, [id]);

  return (
    <Section
      className="create"
      title={`${id ? 'Editar' : 'Criar'} publicação`}
      description={`${id ? 'Editar' : 'Criar'} publicação`}
    >
      <Row className="mb-5">
        <Col md={12}>
          <Text as="h1" size="2rem" weight={700}>
            {id ? 'Editar' : 'Criar'} publicação
          </Text>
        </Col>
      </Row>
      <Formik
        initialValues={initialValues}
        validationSchema={!id ? createSchema : updateSchema}
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
                      placeholder="Título da publicação"
                      disabled={!!id}
                    />
                  </Col>

                  {!id && (
                    <Col md={4} className="mb-3">
                      <Input
                        cy="test-inputCategory"
                        id="category"
                        name="category"
                        label="Categoria da publicação"
                        as="select"
                        isInvalid={(errors.category && touched.category) || false}
                        msg={errors.category}
                        placeholder="-- Selecione --"
                      >
                        <>
                          <option>-- Selecione --</option>
                          {categories.map((category) => (
                            <option value={category.id}>{category.title}</option>
                          ))}
                        </>
                      </Input>
                    </Col>
                  )}

                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputDescription"
                      isInvalid={(errors.description && touched.description) || false}
                      msg={errors.description}
                      id="description"
                      name="description"
                      as="input"
                      label="Descrição:"
                      component="textarea"
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                      {id ? 'Editar' : 'Criar'} publicação
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

export default Post;
