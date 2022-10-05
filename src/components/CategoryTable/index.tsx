import React, { useEffect, useState } from 'react';
import { Button, Card, Col, ListGroupItem, Modal, Row } from 'react-bootstrap';
import { HiTrash } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { ICategory } from '../../interfaces';
import categoryService from '../../services/category.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import Text from '../Text';
import './style.scss';

const CategoryTable = (): React.ReactElement => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [delId, setDelId] = useState<string>('');

  const handleClose = (): void => setOpen(false);
  const handleOpen = (id: string): void => {
    setDelId(id);
    setOpen(true);
  };

  async function deleteHandler(id: string): Promise<void> {
    try {
      categoryService.deleteCategory(id);
      const newCategories = categories.filter((category) => category.id !== id);
      setCategories(newCategories);
      setDelId('');
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
    <div>
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
            <Modal show={open} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Excluir categoria?</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>
                  Você tem certeza que deseja excluir esta categoria?
                  <br />
                  <br /> Suas ações não poderam ser desfeitas.
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => deleteHandler(delId)}>
                  Excluir
                </Button>
              </Modal.Footer>
            </Modal>
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
    </div>
  );
};

export default CategoryTable;
