import React from 'react';
import SecurityLink from '../SecurityLink';
import Text from '../Text';
import style from './style.module.scss';

interface IProps {
  title: string;
  link?: string;
}

export const Chip = ({ title, link }: IProps): React.ReactElement =>
  link ? (
    <Text as="strong" weight={700} size="1rem" className={style.chip__clickable}>
      <SecurityLink isActive to={link}>
        {title}
      </SecurityLink>
    </Text>
  ) : (
    <Text as="strong" weight={700} size="1rem" className={style.chip}>
      {title}
    </Text>
  );
