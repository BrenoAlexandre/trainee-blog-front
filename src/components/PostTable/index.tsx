import React from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import Post from '../Post';
import Text from '../Text';
import './style.scss';

const PostTable = (props: { posts: IPost[]; myPosts: boolean }): React.ReactElement => {
  const { posts, myPosts } = props;
  const { logged, user } = useAuth();

  const userPosts = myPosts ? posts.slice(0, 5) : posts;

  return (
    <div>
      <Card>
        {userPosts.length > 0 ? (
          <>
            {userPosts.map((post) => (
              <ListGroupItem key={post.id}>
                <Post post={post} myPosts={myPosts} />
              </ListGroupItem>
            ))}
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text as="span" size="0.9rem">
                  {myPosts && posts.length > 5 && <Link to={`/user/${user.id}`}> Ver mais </Link>}
                </Text>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text as="span" size="0.9rem">
                {logged ? (
                  <Link to="/actions/post" style={{ color: '#000000', textDecoration: 'none' }}>
                    Comece a publicar!
                  </Link>
                ) : (
                  'Acesse sua conta e veja suas publicações aqui!'
                )}
              </Text>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default PostTable;
