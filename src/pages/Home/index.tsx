import axios from 'axios';
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
import { useCatcher } from '../../hooks/useCatcher';

function toastWarn(msg: string): void {
  toastMsg(ToastType.Warning, msg);
}

const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { catcher } = useCatcher();

  const { user, logged, Logout } = useAuth();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seeMore, setSeeMore] = useState<boolean>(false);

  const targetPage = useRef<number | null>(0);

  const fetchPosts = useCallback((page): void => {
    PostService.getPosts(page, 5)
      .then((response) => {
        setPosts((state) => [...state, ...response.data]);
        if (response.next) {
          targetPage.current = response.next;
        } else {
          targetPage.current = null;
          setSeeMore(true);
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error) !== undefined) {
          catcher('getPosts', error);
        }
      });
  }, []);

  const fetchLoggedUserPosts = useCallback((userId: string) => {
    PostService.getUserPosts(userId)
      .then((response) => {
        setMyPosts(response);
      })
      .catch((error) => {
        if (axios.isAxiosError(error) !== undefined) {
          catcher('getUserPosts', error);
        }
      });
  }, []);

  function logoutHandler(): void {
    setMyPosts([]);
    Logout();
  }

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      setIsLoading(true);
      fetchPosts(targetPage.current);
      setIsLoading(false);
    }
    return () => {
      isCleaning = true;
    };
  }, [fetchPosts]);

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      setIsLoading(true);
      if (user.id) fetchLoggedUserPosts(user.id);
      setIsLoading(false);
    }
    return () => {
      isCleaning = true;
    };
  }, [fetchLoggedUserPosts, user.id]);

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
                toastWarn('Faça login na plataforma para criar publicações.');
              } else navigate('/actions/post');
            }}
          >
            Nova publicação
          </Button>
          {user.role === 'admin' ? (
            <div style={{ marginLeft: '5px' }}>
              <Button
                type="button"
                variant="secondary"
                cy="test-create"
                onClick={() => {
                  if (!logged) {
                    toastWarn('Faça login na plataforma como admin para criar categorias.');
                  } else navigate('/actions/category');
                }}
              >
                Nova Categoria
              </Button>
            </div>
          ) : null}
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
            style={{ visibility: seeMore ? 'hidden' : 'visible' }}
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
