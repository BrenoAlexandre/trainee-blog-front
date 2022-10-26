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
import { useAuth } from '../../../contexts/AuthContext';
import { CustomModal } from '../../../components/CustomModal';

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
  ownerId: string;
  title: string;
  description: string;
  category: string;
  owner: string;
}

const defaultValue = {
  ownerId: '',
  title: '',
  description: '',
  category: '',
  owner: '',
} as ICreate;

const Post: React.FunctionComponent = () => {
  const { id } = useParams();
  const { user, checkToken } = useAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(defaultValue as ICreate);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClose = (): void => setShowModal(false);
  const handleOpen = (): void => setShowModal(true);

  async function submitHandler(values: ICreate): Promise<void> {
    try {
      const { title, description, category } = values;
      setLoader(true);

      if (id) {
        PostService.updatePost(id, title, description, category);
        toastMsg(ToastType.Success, 'Atualização realizada com sucesso!');
      } else {
        await PostService.publishPost(title, description, category);
        toastMsg(ToastType.Success, 'Publicação realizada com sucesso!');
      }

      setLoader(false);
      navigate(-1);
    } catch (error) {
      setLoader(false);
      toastMsg(ToastType.Error, (error as Error).message);
    }
  }

  async function deleteHandler(): Promise<void> {
    if (id) {
      PostService.deletePost(id);
    }

    navigate(-1);
  }

  useEffect(() => {
    const isValid = checkToken();
    if (!isValid) navigate(-1);

    async function getPostById(): Promise<void> {
      if (id) {
        await PostService.getPost(id)
          .then((res) => {
            if (res) {
              const obj = {
                ownerId: res.owner.id,
                title: res.title,
                description: res.description,
                category: res.category.id,
                owner: res.owner.id,
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
  }, [checkToken, id, navigate]);

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
        {({ values, errors, touched }) => (
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
                      disabled={!!loader}
                    />
                  </Col>
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
                      disabled={!!loader}
                    >
                      <>
                        <option>-- Selecione --</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </>
                    </Input>
                  </Col>
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
                      disabled={!!loader}
                    />
                  </Col>

                  <Col md={12} className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="submit" cy="test-createPost" variant="primary" disabled={!!loader}>
                      {id ? 'Editar' : 'Criar'} publicação
                    </Button>
                    {id && values.ownerId === user.id && (
                      <>
                        <Button
                          cy="test-deletePost"
                          variant="danger"
                          disabled={!!loader}
                          style={{ marginLeft: '5px' }}
                          onClick={() => handleOpen()}
                        >
                          Deletar publicação
                        </Button>
                        {showModal && (
                          <CustomModal
                            title="Excluir publicação?"
                            actionButtonTitle="excluir"
                            actionFn={() => deleteHandler()}
                            handleClose={handleClose}
                          >
                            <p>
                              Você tem certeza que deseja excluir esta publicação?
                              <br />
                              <br /> Suas ações não poderam ser desfeitas.
                            </p>
                          </CustomModal>
                        )}
                      </>
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

export default Post;
