import React from 'react';
import { Card, ListGroup, Row } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import IPost from '../../interfaces/IPost';
import Text from '../Text';
import './style.scss';

const PostTable = (props: { posts: IPost[] }): React.ReactElement => {
  // const navigate = useNavigate();
  const { posts } = props;

  return (
    <div>
      <Card>
        {posts.map((post) => (
          <ListGroup.Item key={post.id}>
            <Row>
              <div className="cardHeader">
                <Text as="h2" size="1.5rem" weight={700} className="title">
                  {post.title}
                </Text>
                <Text as="span" weight={500} className="owner">
                  Publicado por:{' '}
                  <a href="/">
                    <strong>{post.owner.name}</strong>
                  </a>
                </Text>
                <Text as="strong" weight={700} className="category">
                  {post.category.title}
                </Text>
              </div>
              <Text as="h2" size="1rem" weight={500} className="description">
                {post.description}
              </Text>
            </Row>
          </ListGroup.Item>
        ))}
      </Card>
    </div>
  );
};

export default PostTable;
