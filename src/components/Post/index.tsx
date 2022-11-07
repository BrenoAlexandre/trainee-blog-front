import React from 'react';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IPost from '../../interfaces/IPost';
import formatDate from '../../utils/formatDate';
import { Chip } from '../Chip';
import SecurityLink from '../SecurityLink';
import Text from '../Text';
import style from './style.module.scss';

interface IProps {
  post: IPost;
  myPost: boolean;
  isLogged: boolean;
}

const Post = ({ post, myPost, isLogged }: IProps): React.ReactElement => (
  <>
    {myPost ? (
      <Row>
        <div className={style.cardHeader}>
          <Text as="h2" size="1rem" weight={700} className={style.title}>
            <Link to={`/actions/post/${post.id}`}>{post.title.substring(0, 50)}</Link>
          </Text>
          <Chip title={post.category.title} link={`/category/${post.category.id}`} />
        </div>
        <Text as="h2" size="1rem" weight={500} className={style.description__myPost}>
          {post.description}
        </Text>
        <Text as="h6" size="0.9rem" weight={500} className={style.publish_date}>
          Publicado em: {formatDate(post.created_at.toString())}
        </Text>
      </Row>
    ) : (
      <Row>
        <div className={style.cardHeader}>
          <Text as="h2" size="1.5rem" weight={700} className={style.title}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </Text>
          <Text as="span" weight={500} className={style.owner__clickable}>
            Publicado por:{' '}
            <SecurityLink isActive={isLogged} to={`/user/${post.owner.id}`}>
              <strong>{post.owner.name || '???'}</strong>
            </SecurityLink>
          </Text>
          <Chip title={post.category.title || '???'} link={`/category/${post.category.id}`} />
        </div>
        <Text as="h2" size="1rem" weight={500} className={style.description}>
          {post.description}
        </Text>
        <Text as="h6" size="0.9rem" weight={500} className={style.publish_date}>
          Publicado em: {formatDate(post.created_at.toString())}
        </Text>
      </Row>
    )}
  </>
);

export default Post;
