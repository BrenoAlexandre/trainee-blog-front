import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CategoryTable from '../../components/CategoryTable';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import { IUser } from '../../interfaces';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import UsersService from '../../services/users.service';

const User: React.FunctionComponent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<IUser>({ id: '', name: '', email: '', role: '' });
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
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
  }, [id]);
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
