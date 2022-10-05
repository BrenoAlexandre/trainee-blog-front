import React from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import Post from '../Post';
import Text from '../Text';
import './style.scss';

const PostTable = (props: { posts: IPost[]; myPosts: boolean; profileId?: string }): React.ReactElement => {
  const { posts, myPosts, profileId } = props;
  const { logged, user } = useAuth();
  const navigate = useNavigate();

  const userPosts = myPosts ? posts.slice(0, 5) : posts;

  return (
    <div>
      <Card>
        {userPosts.length > 0 ? (
          <>
            {userPosts.map((post) => (
              <ListGroupItem
                key={post.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Post post={post} myPosts={myPosts} />
                {profileId === user.id && (
                  <HiPencil
                    size={30}
                    className="table__icon-update table__icon-svg"
                    onClick={() => navigate(`/actions/post/${post.id}`)}
                  />
                )}
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
