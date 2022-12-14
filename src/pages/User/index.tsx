import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryTable from './components/CategoryTable';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import { IUser } from '../../interfaces';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import UsersService from '../../services/users.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import { useCatcher } from '../../hooks/useCatcher';
import ERole from '../../enums/ERole';
import PageTitle from '../../components/PageTitle';
import { CustomActionModal } from '../../components/CustomActionModal';

const defaultProfile: IUser = { id: '', name: '', email: '', role: '' };

const User: React.FunctionComponent = () => {
  const { id } = useParams();
  const { user, checkToken, updateUserName } = useAuth();

  const { catcher } = useCatcher();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<IUser>(defaultProfile);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (): void => setOpen(false);
  const handleOpen = (): void => {
    setNewName(profile.name);
    setOpen(true);
  };

  async function editName(): Promise<void> {
    await UsersService.update(newName)
      .then(() => {
        setProfile({ ...profile, name: newName });
        updateUserName(newName);
        setNewName('');
        handleClose();
        toastMsg(ToastType.Success, 'Usuário alterado com sucesso!');
      })
      .catch((error) => {
        catcher('updateUser', error);
      });
  }

  const validate = useCallback(() => {
    const userJWTIsValid = checkToken();

    if (!userJWTIsValid) navigate(-1);
  }, [checkToken, navigate]);

  const getUser = useCallback(
    (userId: string) => {
      UsersService.findById(userId)
        .then((response) => {
          setProfile(response);
        })
        .catch((error) => {
          catcher('findUserById', error);
        });
    },
    [catcher]
  );

  const getUserPosts = useCallback(
    (userId: string) => {
      PostService.getUserPosts(userId)
        .then((response) => {
          setPosts(response);
        })
        .catch((error) => {
          catcher('getUserPosts', error);
        });
    },
    [catcher]
  );

  useEffect(() => {
    let isCleaning = false;

    if (!isCleaning) {
      validate();

      if (id) {
        getUser(id);
        getUserPosts(id);
      }
    }

    return () => {
      isCleaning = true;
    };
  }, [id, getUserPosts, getUser, navigate, validate]);
  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      {user.id === id ? (
        <>
          <PageTitle title="Meu perfil" actionFn={() => navigate(-1)} actionText="Voltar" />
          <Col md={6}>
            <Text as="h1" size="1.8rem" weight={700}>
              {profile.name}
              <HiPencil size={22} className="table__icon-update table__icon-svg" onClick={() => handleOpen()} />
              {open ? (
                <CustomActionModal
                  title="Editar usuário"
                  actionButtonTitle="Confirmar edição"
                  actionFn={() => editName()}
                  handleClose={handleClose}
                >
                  Nome do usuário:
                  <br />
                  <input
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                    }}
                  />
                </CustomActionModal>
              ) : null}
            </Text>
          </Col>
        </>
      ) : (
        <PageTitle title={profile.name} actionFn={() => navigate(-1)} actionText="Voltar" />
      )}
      <Row>
        <Col md={9}>
          <PostTable posts={posts} profileId={id} />
        </Col>
        <Col md={3}>
          {user.id === id && user.role === ERole.admin ? (
            <>
              <Text as="h2" size="1.5rem" weight={500}>
                Minhas categorias
              </Text>
              <Col md={9}>
                <CategoryTable />
              </Col>
            </>
          ) : null}
        </Col>
      </Row>
    </Section>
  );
};
export default User;
