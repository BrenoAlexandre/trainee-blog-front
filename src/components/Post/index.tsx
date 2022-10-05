import React from 'react';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IPost from '../../interfaces/IPost';
import formatDate from '../../utils/formatDate';
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
              <Link to={`/actions/post/${post.id}`}>{post.title.substring(0, 50)}</Link>
            </Text>
            <Text as="strong" weight={700} size="0.75rem" className="category">
              <Link to={`/category/${post.category.id}`}>{post.category.title || '???'}</Link>
            </Text>
          </div>
          <Text as="h2" size="1rem" weight={500} className="description__myPosts">
            {post.description}
          </Text>
          <Text as="h6" size="0.9rem" weight={500} className="publish_date">
            Publicado em: {formatDate(post.created_at.toString())}
          </Text>
        </Row>
      ) : (
        <Row>
          <div className="cardHeader">
            <Text as="h2" size="1.5rem" weight={700} className="title">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </Text>
            <Text as="span" weight={500} className="owner">
              Publicado por:{' '}
              <Link to={`/user/${post.owner.id}`}>
                <strong>{post.owner.name || '???'}</strong>
              </Link>
            </Text>
            <Text as="strong" weight={700} className="category">
              <Link to={`/category/${post.category.id}`}>{post.category.title}</Link>
            </Text>
          </div>
          <Text as="h2" size="1rem" weight={500} className="description">
            {post.description}
          </Text>
          <Text as="h6" size="0.9rem" weight={500} className="publish_date">
            Publicado em: {formatDate(post.created_at.toString())}
          </Text>
        </Row>
      )}
    </>
  );
};

export default Post;
