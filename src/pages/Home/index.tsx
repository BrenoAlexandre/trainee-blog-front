import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import Section from '../../components/Section';
import Text from '../../components/Text';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import PostService from '../../services/posts.service';
import UserPostsTable from './components/UserPosts';
import { useCatcher } from '../../hooks/useCatcher';
import ERole from '../../enums/ERole';
import PageTitle from '../../components/PageTitle';
import formatDate from '../../utils/formatDate';
import style from './style.module.scss';
import SecurityLink from '../../components/SecurityLink';

function toastWarn(msg: string): void {
  toastMsg(ToastType.Warning, msg);
}

const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { catcher } = useCatcher();

  const { user, logged } = useAuth();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seeMore, setSeeMore] = useState<boolean>(false);

  const targetPage = useRef<number | null>(0);

  const fetchPosts = useCallback(
    (page): void => {
      PostService.getPosts(page, 6)
        .then((response) => {
          setPosts((state) => [...state, ...response.data]);
          if (response.next) {
            targetPage.current = response.next;
          } else {
            targetPage.current = null;
            setSeeMore(true);
          }
        })
        .catch((error) => {
          if (axios.isAxiosError(error) !== undefined) {
            catcher('getPosts', error);
          }
        });
    },
    [catcher]
  );

  const fetchLoggedUserPosts = useCallback(
    (userId: string) => {
      PostService.getUserPosts(userId)
        .then((response) => {
          setMyPosts(response);
        })
        .catch((error) => {
          if (axios.isAxiosError(error) !== undefined) {
            catcher('getUserPosts', error);
          }
        });
    },
    [catcher]
  );

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      setIsLoading(true);
      fetchPosts(targetPage.current);
      setIsLoading(false);
    }
    return () => {
      isCleaning = true;
    };
  }, [fetchPosts]);

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      setIsLoading(true);
      if (user.id) fetchLoggedUserPosts(user.id);
      setIsLoading(false);
    }
    return () => {
      isCleaning = true;
    };
  }, [fetchLoggedUserPosts, user.id]);

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <PageTitle title="Posts" actionFn={() => navigate('/')} actionText="Fazer login" />
      <Row>
        <div className={style.actionBar}>
          <button
            type="button"
            className={style.button__primary}
            onClick={() => {
              if (!logged) {
                toastWarn('Faça login na plataforma para criar publicações.');
              } else navigate('/actions/post');
            }}
          >
            Nova publicação
          </button>
          {user.role === ERole.admin ? (
            <div>
              <button
                type="button"
                className={style.button__secondary}
                onClick={() => {
                  if (!logged) {
                    toastWarn('Faça login na plataforma como admin para criar categorias.');
                  } else navigate('/actions/category');
                }}
              >
                Nova categoria
              </button>
            </div>
          ) : null}
        </div>
        <Col md={9}>
          <div className={style.postsWrapper}>
            {posts.map((post) => (
              <div key={post.id} className={style.post}>
                <div className={style.post__container}>
                  <div className={style.post__header}>
                    <SecurityLink to={`/user/${post.owner.id}`}>
                      <p className={style.post__header__owner}>{post.owner.name}</p>
                    </SecurityLink>
                    <SecurityLink to={`/post/${post.id}`}>
                      <p className={style.post__header__title}>{post.title}</p>
                    </SecurityLink>
                  </div>

                  <div className={style.post__body}>
                    <p className={style.post__body__description}>{post.description}</p>
                  </div>

                  <div className={style.post__footer}>{formatDate(post.created_at.toString())}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {!seeMore ? (
              <button
                type="button"
                disabled={isLoading}
                className={style.button__secondary}
                onClick={() => fetchPosts(targetPage.current)}
              >
                Carregar mais
              </button>
            ) : null}
          </div>
        </Col>

        <Col md={3}>
          <div className={style.myPosts}>
            <Text as="h2" size="1.5rem" weight={500}>
              Minhas publicações
            </Text>

            <UserPostsTable posts={myPosts} />
          </div>
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
