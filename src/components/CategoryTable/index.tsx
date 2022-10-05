import React, { useEffect, useState } from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
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

  async function deleteHandler(id: string): Promise<void> {
    try {
      categoryService.deleteCategory(id);
      const newCategories = categories.filter((category) => category.id !== id);
      setCategories(newCategories);
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
                  onClick={() => deleteHandler(category.id)}
                />
              </ListGroupItem>
            ))}
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
