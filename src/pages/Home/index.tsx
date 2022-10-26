import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import Button from '../../components/Button';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import UserPostsTable from './components/UserPosts';

function toast(msg: string): void {
  toastMsg(ToastType.Warning, msg);
}

const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, logged, Logout } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const targetPage = useRef<number | null>(0);
  const hideSeeMore = useRef<boolean>(false);

  const fetchPosts = useCallback(
    (page): void => {
      setIsLoading(true);

      PostService.getPosts(page, 5)
        .then((response) => {
          setPosts((state) => [...state, ...response.data]);
          targetPage.current = response.next;

          if (!response.next) hideSeeMore.current = true;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            toastMsg(ToastType.Info, 'Não há mais publicações.');
            hideSeeMore.current = true;
          } else toastMsg(ToastType.Error, 'Ocorreu um problema ao carregar suas vagas. Por favor, tente novamente.');
        })
        .finally(() => setIsLoading(false));
      if (user.id) {
        setIsLoading(true);

        PostService.getUserPosts(user.id)
          .then((response) => {
            setMyPosts(response);
          })
          .finally(() => setIsLoading(false));
      }
    },
    [user.id]
  );

  function logoutHandler(): void {
    setMyPosts([]);
    Logout();
  }

  useEffect(() => {
    let isCleanning = false;

    if (!isCleanning) {
      fetchPosts(targetPage.current);
    }
    return () => {
      isCleanning = true;
    };
  }, [fetchPosts]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            Posts
          </Text>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mt-3 mb-2" style={{ display: 'flex' }}>
          <Button
            type="button"
            variant="primary"
            cy="test-create"
            onClick={() => {
              if (!logged) {
                toast('Faça login na plataforma para criar publicações.');
              } else navigate('/actions/post');
            }}
          >
            Nova publicação
          </Button>
          {user.role === 'admin' && (
            <div style={{ marginLeft: '5px' }}>
              <Button
                type="button"
                variant="secondary"
                cy="test-create"
                onClick={() => {
                  navigate('/actions/category');
                }}
              >
                Nova Categoria
              </Button>
            </div>
          )}
          {logged ? (
            <div style={{ marginLeft: '5px' }}>
              <Button type="button" variant="dark" cy="test-create" onClick={() => logoutHandler()}>
                Encerrar sessão
              </Button>
            </div>
          ) : (
            <div style={{ marginLeft: '5px' }}>
              <Button type="button" variant="secondary" cy="test-create" onClick={() => navigate('/')}>
                Fazer login
              </Button>
            </div>
          )}
        </Col>
        <Col md={9}>
          <PostTable posts={posts} />
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            cy="test-seeMore"
            style={{ visibility: hideSeeMore.current ? 'hidden' : 'visible' }}
            onClick={() => fetchPosts(targetPage.current)}
          >
            Carregar mais
          </Button>
        </Col>
        <Col md={3}>
          <Text as="h2" size="1.5rem" weight={500}>
            Minhas publicações
          </Text>
          <UserPostsTable posts={myPosts} />
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
