import React from 'react';
import Select from 'react-select';
import { useApp } from 'context';

const DeckSelectRecent = (props) => {
  // setActiveDeck is default and props.setActiveDeck is used in Diff
  // to select deckFrom or deckTo
  const { setActiveDeck, recentDecks, isMobile } = useApp();

  const options = recentDecks.map((i) => {
    return {
      value: i.deckid,
      name: 'deck',
      label: i.name,
    };
  });

  const handleChange = (e) => {
    if (e.value.length === 32) {
      props.setActiveDeck
        ? props.setActiveDeck({ src: 'shared', deckid: e.value })
        : setActiveDeck({ src: 'shared', deckid: e.value });
    } else {
      props.setActiveDeck
        ? props.setActiveDeck({ src: 'twd', deckid: e.value })
        : setActiveDeck({ src: 'twd', deckid: e.value });
    }
  };

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      isSearchable={!isMobile}
      name="decks"
      maxMenuHeight={isMobile ? window.screen.height - 200 : 600}
      placeholder="Select Deck"
      value={options.find((obj) => obj.value === props.deckid)}
      onChange={handleChange}
    />
  );
};

export default DeckSelectRecent;
