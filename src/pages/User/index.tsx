import React, { useEffect, useState } from 'react';
import { Button as BootButton, Col, Modal, Row } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryTable from '../../components/CategoryTable';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import { IUser } from '../../interfaces';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import UsersService from '../../services/users.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';

const User: React.FunctionComponent = () => {
  const { id } = useParams();
  const { user, checkToken } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IUser>({ id: '', name: '', email: '', role: '' });
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (): void => setOpen(false);
  const handleOpen = (): void => {
    setNewName(profile.name);
    setOpen(true);
  };

  async function editName(): Promise<void> {
    try {
      await UsersService.update(newName).then(() => {
        setProfile({ ...profile, name: newName });
        setNewName('');
        handleClose();
        toastMsg(ToastType.Success, 'Usuário alterado com sucesso!');
      });
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  }

  useEffect(() => {
    const isValid = checkToken();
    if (!isValid) navigate(-1);

    async function getUser(): Promise<void> {
      if (id) {
        const dbUser = await UsersService.findById(id);
        setProfile(dbUser);
      }
    }
    async function getUserPosts(): Promise<void> {
      if (id) {
        const dbPosts = await PostService.getUserPosts(id);
        setPosts(dbPosts);
      }
    }

    getUser();
    getUserPosts();
  }, [checkToken, id, navigate]);
  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      {user.id === id && (
        <Row>
          <Col md={8}>
            <Text as="h1" size="2rem" weight={700}>
              Meu perfil
            </Text>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={8}>
          <Text as="h1" size="1.8rem" weight={700}>
            {profile?.name || ''}
            <HiPencil size={22} className="table__icon-update table__icon-svg" onClick={() => handleOpen()} />
            <Modal show={open} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Editar usuário</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                Nome do usuário:
                <br />
                <input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                  }}
                />
              </Modal.Body>

              <Modal.Footer>
                <BootButton variant="secondary" onClick={handleClose}>
                  Cancelar
                </BootButton>
                <BootButton variant="primary" onClick={() => editName()}>
                  Confirmar edição
                </BootButton>
              </Modal.Footer>
            </Modal>
          </Text>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <PostTable posts={posts} myPosts={false} profileId={id} />
        </Col>
        <Col md={3}>
          {user.id === id && user.role === 'admin' && (
            <>
              <Text as="h2" size="1.5rem" weight={500}>
                Minhas categorias
              </Text>
              <Col md={9}>
                <CategoryTable />
              </Col>
            </>
          )}
        </Col>
      </Row>
    </Section>
  );
};
export default User;
