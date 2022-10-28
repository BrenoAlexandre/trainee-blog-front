import React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
  isActive?: boolean;
  to: string;
  children: React.ReactNode;
}

const SecurityLink = ({ isActive, to: link, children }: IProps): React.ReactElement =>
  isActive ? <Link to={link}>{children}</Link> : <>{children}</>;

SecurityLink.defaultProps = { isActive: true };
export default SecurityLink;
