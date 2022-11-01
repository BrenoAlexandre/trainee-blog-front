import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useCatcher } from '../../hooks/useCatcher';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import formatDateUtils from '../../utils/formatDate';
import './style.scss';

const Post: React.FunctionComponent = () => {
  const { id } = useParams();
  const { catcher } = useCatcher();

  const [post, setPost] = useState<IPost>({
    id: id ?? '',
    title: '',
    description: '',
    category: { id: '', title: '' },
    owner: { id: '', name: '' },
    likes: 0,
    created_at: '',
  });

  const formatDate = (date: string | Date): string =>
    formatDateUtils(typeof date === 'string' ? date : date.toString());

  const findPost = useCallback(() => {
    if (id) {
      PostService.getPost(id)
        .then((response) => {
          setPost({ ...response, created_at: formatDate(response.created_at) });
        })
        .catch((error) => {
          if (axios.isAxiosError(error) !== undefined) {
            catcher('getPost', error);
          }
        });
    }
  }, [id]);

  useEffect(() => {
    let isCleaning = false;

    if (!isCleaning) {
      findPost();
    }

    return () => {
      isCleaning = true;
    };
  }, [findPost]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            {post.title}
          </Text>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text as="h2" size="1.5rem">
              {post.owner.name}{' '}
            </Text>
            <Text as="h2" size="1rem" className="category">
              {post.category.title}
            </Text>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-start',
            marginLeft: '25px',
            maxWidth: '600px',
          }}
        >
          <Text as="span" size="1rem">
            {post.description}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-start',
            marginLeft: '10px',
          }}
        >
          <Text as="span" size="1rem">
            Publicado em: {post.created_at}
          </Text>
        </Col>
      </Row>
    </Section>
  );
};
export default Post;
