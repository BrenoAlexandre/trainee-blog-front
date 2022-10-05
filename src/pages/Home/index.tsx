import React, { useEffect, useState } from 'react';
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
  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);

  async function fetchPosts(): Promise<IPost[]> {
    const dbPosts = await PostService.getPosts();
    setPosts(dbPosts);
    return dbPosts;
  }

  async function fetchMyPosts(): Promise<IPost[]> {
    const dbPosts = await PostService.getMyPosts();
    setMyPosts(dbPosts);
    return dbPosts;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function logoutHandler(): any {
    setMyPosts([]);
    Logout();
  }

  function toast(msg: string): void {
    toastMsg(ToastType.Warning, msg);
  }

  useEffect(() => {
    fetchPosts();
    if (user && logged) {
      fetchMyPosts();
    }
  }, [user, logged]);

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
