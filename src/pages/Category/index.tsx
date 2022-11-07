import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import PostTable from '../../components/PostTable';
import Section from '../../components/Section';
import { useCatcher } from '../../hooks/useCatcher';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';

const Category: React.FunctionComponent = () => {
  const { id } = useParams();
  const { catcher } = useCatcher();
  const navigate = useNavigate();

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
          if (axios.isAxiosError(error) !== undefined) {
            catcher('getCategoryPosts', error);
          }
        });
    }
  }, [id, catcher]);

  useEffect(() => {
    let isCleaning = false;

    if (!isCleaning) {
      getCategoryPosts();
    }

    return () => {
      isCleaning = true;
    };
  }, [getCategoryPosts]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <PageTitle title={category} actionFn={() => navigate(-1)} actionText="Voltar" />
      <Row>
        <Col md={9}>
          <PostTable posts={posts} />
        </Col>
      </Row>
    </Section>
  );
};
export default Category;
