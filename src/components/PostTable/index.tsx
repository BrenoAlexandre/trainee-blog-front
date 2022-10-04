import React from 'react';
import { Card, Col, ListGroupItem, Row } from 'react-bootstrap';
import IPost from '../../interfaces/IPost';
import Post from '../Post';
import Text from '../Text';
import './style.scss';

const PostTable = (props: { posts: IPost[]; myPosts: boolean }): React.ReactElement => {
  const { posts, myPosts } = props;

  return (
    <div>
      <Card>
        {posts.length ? (
          posts.map((post) => (
            <ListGroupItem key={post.id}>
              <Post post={post} myPosts={myPosts} />
            </ListGroupItem>
          ))
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

export default PostTable;
