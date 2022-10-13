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

const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, logged, Logout } = useAuth();
  const currentPage = useRef<number>(0);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hideSeeMore = useRef<boolean>(false);

  const fetchPosts = useCallback((targetPage): void => {
    setIsLoading(true);
    PostService.getPosts(targetPage, 5)
      .then((dbPosts) => {
        setPosts((state) => [...state, ...dbPosts.data]);
        currentPage.current = dbPosts.next;

        if (dbPosts.data.length < 5) hideSeeMore.current = true;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toastMsg(ToastType.Info, 'Não há mais publicações novas.');
          hideSeeMore.current = true;
        } else toastMsg(ToastType.Error, 'Ocorreu um problema ao carregar suas vagas. Por favor, tente novamente.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function fetchMyPosts(): Promise<IPost[]> {
    const dbPosts = await PostService.getMyPosts();
    setMyPosts(dbPosts);
    return dbPosts;
  }

  function logoutHandler(): void {
    setMyPosts([]);
    Logout();
  }

  function toast(msg: string): void {
    toastMsg(ToastType.Warning, msg);
  }

  useEffect(() => {
    fetchPosts(currentPage.current);
    if (user && logged) {
      fetchMyPosts();
    }
  }, [user, logged, fetchPosts]);

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
                  if (user.role !== 'admin') {
                    toast('Apenas admins podem criar novas categorias.');
                  } else navigate('/actions/category');
                }}
              >
                Nova Categoria
              </Button>
            </div>
          )}
          {!logged ? (
            <div style={{ marginLeft: '5px' }}>
              <Button type="button" variant="secondary" cy="test-create" onClick={() => navigate('/')}>
                Fazer login
              </Button>
            </div>
          ) : (
            <div style={{ marginLeft: '5px' }}>
              <Button type="button" variant="dark" cy="test-create" onClick={() => logoutHandler()}>
                Encerrar sessão
              </Button>
            </div>
          )}
        </Col>
        <Col md={9}>
          <PostTable posts={posts} myPosts={false} />
          {!hideSeeMore.current && (
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              cy="test-seeMore"
              onClick={() => fetchPosts(currentPage.current)}
            >
              Carregar mais
            </Button>
          )}
        </Col>
        <Col md={3}>
          <Text as="h2" size="1.5rem" weight={500}>
            Minhas publicações
          </Text>
          <PostTable posts={myPosts} myPosts />
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
