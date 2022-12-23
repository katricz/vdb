import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, ErrorOverlay } from 'components';
import { useApp, deckAdd } from 'context';
import { useDeckImport } from 'hooks';
import { deckServices } from 'services';

const DeckImportText = ({ isAnonymous, setBadCards, handleCloseModal }) => {
  const {
    isMobile,
    setShowFloatingButtons,
    setShowMenuButtons,
    cryptCardBase,
    libraryCardBase,
  } = useApp();
  const navigate = useNavigate();

  const [deckText, setDeckText] = useState('');
  const [emptyError, setEmptyError] = useState(false);
  const [importError, setImportError] = useState(false);
  const refText = useRef();

  const handleChange = (event) => {
    setDeckText(event.target.value);
  };

  const handleClose = () => {
    handleCloseModal();
    setDeckText('');
  };

  const importDeckFromText = async () => {
    setImportError(false);

    if (deckText) {
      setEmptyError(false);

      const d = await useDeckImport(deckText, cryptCardBase, libraryCardBase);

      deckServices
        .deckImport({ ...d, anonymous: isAnonymous })
        .then((response) => response.json())
        .then((data) => {
          deckAdd({
            ...d,
            deckid: data.deckid,
          });
          navigate(`/decks/${data.deckid}`);
          setBadCards(d.badCards);
          setShowMenuButtons(false);
          setShowFloatingButtons(true);
          setDeckText('');
          handleClose();
        })
        .catch(() => {
          setImportError(true);
        });
    } else {
      setEmptyError(true);
    }
  };

  const placeholder = `\
Paste deck here (text from TWD, Amaranth, Lackey).

It accepts (but work without also) headers like:
Deck Name: xxxx
Author: xxxx
Description: xxxx

It accept crypt like (even lowercase):
5x Cybele	   10  ANI DAI OBF PRE SER THA	Baali:4
5x Cybele
5 Cybele

It accept library like (even lowercase):
12x Ashur Tablets
12 Ashur Tablets

It will skip other (useless) lines, you don't have to remove it yourself.
`;

  return (
    <Modal
      handleClose={handleClose}
      /* TODO add onShow */
      onShow={() => refText.current.focus()}
      size="lg"
      dialogClassName={isMobile ? '' : null}
      title="Import from Text"
    >
      <div>
        <textarea
          className="focus:text-red-500 font-mono text-sm"
          rows={isMobile ? '20' : '25'}
          value={deckText}
          placeholder={placeholder}
          onChange={handleChange}
          ref={refText}
          autoFocus
        />
        <div className={isMobile ? 'flex justify-end' : 'flex justify-end'}>
          <Button variant="primary" onClick={importDeckFromText}>
            Import
          </Button>
        </div>
        {emptyError && (
          <ErrorOverlay placement="bottom">ENTER DECK LIST</ErrorOverlay>
        )}
        {importError && (
          <ErrorOverlay placement="bottom">ERROR DURING IMPORT</ErrorOverlay>
        )}
      </div>
    </Modal>
  );
};

export default DeckImportText;
