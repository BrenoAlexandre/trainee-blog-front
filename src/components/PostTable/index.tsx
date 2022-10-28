import React from 'react';
import { Card, ListGroupItem } from 'react-bootstrap';
import { HiPencil } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import IPost from '../../interfaces/IPost';
import Post from '../Post';
import './style.scss';

interface IProps {
  posts: IPost[];
  profileId?: string;
}

const PostTable = ({ posts, profileId }: IProps): React.ReactElement => {
  const { user, logged } = useAuth();
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
              <Post post={post} myPost={false} isLogged={logged} />
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
