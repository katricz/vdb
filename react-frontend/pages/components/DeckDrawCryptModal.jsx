import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ArrowClockwise, Plus } from 'react-bootstrap-icons';

import ResultCrypt from './ResultCrypt.jsx';

function DeckDrawCryptModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className='mx-2'>
            Crypt Draw
          </span>
          <span className='mx-2'>
            <Button variant="outline-secondary" onClick={props.handleReDraw}>
              <ArrowClockwise size={20} />
            </Button>
            <Button variant="outline-secondary" onClick={props.handleDrawOne}>
              <Plus size={20} />
            </Button>
          </span>
          { props.drawedCards &&
            <span className='mx-2'>
              {props.drawedCards.length} / {props.drawedCards.length + props.restCards.length}
            </span>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ResultCrypt
          cards={props.drawedCards}
          sortMode={false}
        />
      </Modal.Body>
    </Modal>
  );
}

export default DeckDrawCryptModal;
