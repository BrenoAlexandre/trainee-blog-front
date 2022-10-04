import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';

const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  useEffect(() => {
    fetchPosts();
    fetchMyPosts();
  }, []);

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
          <Button type="button" variant="primary" cy="test-create" onClick={() => navigate('')}>
            Nova publicação
          </Button>
          {user.role === 'admin' && (
            <div style={{ marginLeft: '5px' }}>
              <Button type="button" variant="secondary" cy="test-create" onClick={() => navigate('')}>
                Nova Categoria
              </Button>
            </div>
          )}
        </Col>
        <Col md={9}>
          <PostTable posts={posts} />
        </Col>
        <Col md={3}>
          <Text as="h2" size="1.5rem" weight={500}>
            Minhas publicações
          </Text>
          <PostTable posts={myPosts} /> {/* Fazer media query para tamanho de tela */}
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
