import React, { useEffect, useState } from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
import { HiTrash } from 'react-icons/hi';
import { useAuth } from '../../../../contexts/AuthContext';
import { ICategory } from '../../../../interfaces';
import categoryService from '../../../../services/category.service';
import toastMsg, { ToastType } from '../../../../utils/toastMsg';
import { CustomActionModal } from '../../../../components/CustomActionModal';
import Text from '../../../../components/Text';
import './style.scss';

const CategoryTable = (): React.ReactElement => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [delId, setDelId] = useState<string>('');

  const handleClose = (): void => {
    setDelId('');
    setShowModal(false);
  };
  const handleOpen = (id: string): void => {
    setDelId(id);
    setShowModal(true);
  };

  async function deleteHandler(): Promise<void> {
    try {
      categoryService.deleteCategory(delId);
      const newCategories = categories.filter((category) => category.id !== delId);
      setCategories(newCategories);
      handleClose();
    } catch (error) {
      toastMsg(ToastType.Warning, 'Você não pode deletar uma categoria relacionada a publicações');
    }
  }

  useEffect(() => {
    async function getCategories(): Promise<void> {
      const dbCategories = await categoryService.getCategories();
      const userCategories = dbCategories.filter((category) => category.owner.id === user.id);
      setCategories(userCategories);
    }
    getCategories();
  }, [user.id]);

  return (
    <Card>
      {categories.length ? (
        <>
          {categories.map((category) => (
            <ListGroupItem
              key={category.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              {category.title}
              <HiTrash
                size={17}
                className="table__icon-trash table__icon-svg"
                onClick={() => handleOpen(category.id)}
              />
            </ListGroupItem>
          ))}
          {showModal && (
            <CustomActionModal
              handleClose={() => handleClose()}
              title="Excluir categoria?"
              actionButtonTitle="Excluir"
              actionFn={() => deleteHandler()}
            >
              <p>
                Você tem certeza que deseja excluir esta categoria?
                <br />
                <br /> Suas ações não poderam ser desfeitas.
              </p>
            </CustomActionModal>
          )}
        </>
      ) : (
        <Row>
          <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text as="span" size="0.9rem">
              <a href="/actions/category" style={{ color: '#000000', textDecoration: 'none' }}>
                Você pode criar categorias!
              </a>
            </Text>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default CategoryTable;
