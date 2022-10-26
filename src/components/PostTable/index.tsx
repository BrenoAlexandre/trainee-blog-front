import React from 'react';
import { Card, ListGroupItem } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import Post from '../Post';
import './style.scss';

const PostTable = (props: { posts: IPost[]; profileId?: string }): React.ReactElement => {
  const { posts, profileId } = props;
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Card>
        <>
          {posts.map((post) => (
            <ListGroupItem
              key={post.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Post post={post} myPost={false} />
              {profileId === user.id && (
                <HiPencil
                  size={30}
                  className="table__icon-update table__icon-svg"
                  onClick={() => navigate(`/actions/post/${post.id}`)}
                />
              )}
            </ListGroupItem>
          ))}
        </>
      </Card>
    </div>
  );
};

export default PostTable;
