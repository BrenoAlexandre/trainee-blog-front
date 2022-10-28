import React from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import IPost from '../../../../interfaces/IPost';
import Post from '../../../../components/Post';
import Text from '../../../../components/Text';
import './style.scss';

interface IProps {
  posts: IPost[];
  profileId?: string;
}

const UserPostsTable = ({ posts, profileId }: IProps): React.ReactElement => {
  const { logged, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Card>
        {logged ? (
          <>
            {posts.slice(0, 5).map((post) => (
              <ListGroupItem
                key={post.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Post post={post} myPost isLogged />
                {profileId === user.id ? (
                  <HiPencil
                    size={30}
                    className="table__icon-update table__icon-svg"
                    onClick={() => navigate(`/actions/post/${post.id}`)}
                  />
                ) : null}
              </ListGroupItem>
            ))}
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text as="span" size="0.9rem">
                  {posts.length > 5 ? (
                    <Link to={`/user/${user.id}`}> Ver mais </Link>
                  ) : (
                    <>
                      {posts.length === 0 ? (
                        <Link to="/actions/post" style={{ color: '#000000', textDecoration: 'none' }}>
                          Comece a publicar!
                        </Link>
                      ) : null}
                    </>
                  )}
                </Text>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text as="span" size="0.9rem">
                Acesse sua conta e veja suas publicações aqui!
              </Text>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default UserPostsTable;
