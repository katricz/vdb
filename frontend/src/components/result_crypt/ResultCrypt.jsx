import React, { useState, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import {
  ResultCryptTable,
  ResultCryptTotal,
  ResultCryptTotalInfo,
  ButtonFloatClose,
  ButtonFloatAdd,
  ErrorMessage,
} from '@/components';
import { cryptSort } from '@/utils';
import { useApp, deckStore } from '@/context';

const ResultCrypt = ({ cards, setCards, inCompare }) => {
  const {
    setShowCryptSearch,
    addMode,
    isMobile,
    isDesktop,
    cryptSearchSort,
    changeCryptSearchSort,
    showFloatingButtons,
  } = useApp();
  const navigate = useNavigate();
  const deck = useSnapshot(deckStore).deck;
  const isEditable = deck?.isAuthor && !deck?.isPublic && !deck?.isFrozen;

  const sortMethods = {
    'Capacity - Max to Min': 'C↓',
    'Capacity - Min to Max': 'C↑',
    Clan: 'CL',
    Group: 'G',
    Name: 'N',
    Sect: 'S',
  };

  const [showInfo, setShowInfo] = useState(false);
  const toggleShowInfo = () => setShowInfo(!showInfo);

  const handleClear = () => {
    navigate('/crypt');
    setCards(undefined);
    setShowCryptSearch(true);
  };

  const table = useMemo(() => {
    const sortedCards = cryptSort(cards, cryptSearchSort);

    return (
      <ResultCryptTable
        resultCards={sortedCards}
        placement={isDesktop || (!isDesktop && !addMode) ? 'right' : 'bottom'}
      />
    );
  }, [cards, cryptSearchSort]);

  return (
    <>
      {!isMobile && (cards === null || cards.length === 0) && (
        <ErrorMessage>
          {cards === null ? 'CONNECTION PROBLEM' : 'NO CARDS FOUND'}
        </ErrorMessage>
      )}
      {cards && cards.length > 0 && (
        <>
          <ResultCryptTotal
            inCompare={inCompare}
            cards={cards}
            toggleShowInfo={toggleShowInfo}
            sortMethods={sortMethods}
            sortMethod={cryptSearchSort}
            setSortMethod={changeCryptSearchSort}
          />
          {showInfo && (
            <div className="bg-bgSecondary p-2 dark:bg-bgSecondaryDark">
              <ResultCryptTotalInfo cards={cards} />
            </div>
          )}
          {table}
        </>
      )}
      {isMobile && showFloatingButtons && (
        <ButtonFloatClose handleClose={handleClear} />
      )}
      {isMobile && isEditable && <ButtonFloatAdd />}
    </>
  );
};

export default ResultCrypt;
