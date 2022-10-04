import React from 'react';
import { Row } from 'react-bootstrap';
import IPost from '../../interfaces/IPost';
import Text from '../Text';
import './style.scss';

const Post = (props: { post: IPost; myPosts: boolean }): React.ReactElement => {
  const { post, myPosts } = props;

  return (
    <>
      {myPosts ? (
        <Row>
          <div className="cardHeader">
            <Text as="h2" size="1rem" weight={700} className="title">
              <a href={`/post/${post.id}`}>{post.title.substring(0, 50)}</a>
            </Text>
            <Text as="strong" weight={700} size="0.75rem" className="category">
              <a href={`/category/${post.category.id}`}>{post.category.title}</a>
            </Text>
          </div>
          <Text as="h2" size="1rem" weight={500} className="description__myPosts">
            {post.description}
          </Text>
        </Row>
      ) : (
        <Row>
          <div className="cardHeader">
            <Text as="h2" size="1.5rem" weight={700} className="title">
              <a href={`/post/${post.id}`}>{post.title}</a>
            </Text>
            <Text as="span" weight={500} className="owner">
              Publicado por:{' '}
              <a href={`/user/${post.owner.id}`}>
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
      )}
    </>
  );
};

export default Post;
