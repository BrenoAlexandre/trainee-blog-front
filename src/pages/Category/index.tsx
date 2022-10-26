import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import Text from '../../components/Text';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';

const Category: React.FunctionComponent = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [category, setCategory] = useState<string>('');

  const getCategoryPosts = useCallback(() => {
    if (id) {
      PostService.getCategoryPosts(id)
        .then((res) => {
          setPosts(res);
          setCategory(res[0].category.title);
        })
        .catch((error) => {
          toastMsg(ToastType.Error, (error as Error).message);
        });
    }
  }, [id]);

  useEffect(() => {
    let isCleanning = false;

    if (!isCleanning) {
      getCategoryPosts();
    }

    return () => {
      isCleanning = true;
    };
  }, [getCategoryPosts]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            {category}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <PostTable posts={posts} />
        </Col>
      </Row>
    </Section>
  );
};
export default Category;
