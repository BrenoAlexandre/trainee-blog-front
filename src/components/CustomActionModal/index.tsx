import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface IProps {
  title: string;
  actionButtonTitle: string;
  actionFn: () => Promise<void>;
  handleClose: () => void;
  children: React.ReactNode;
}

export const CustomActionModal = ({
  title,
  actionButtonTitle,
  actionFn,
  handleClose,
  children,
}: IProps): React.ReactElement => (
  <Modal show onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>

    <Modal.Body>{children}</Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={actionFn}>
        {actionButtonTitle}
      </Button>
    </Modal.Footer>
  </Modal>
);
