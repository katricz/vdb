import React from 'react';
import DeckChangeName from './DeckChangeName.jsx';
import DeckChangeAuthor from './DeckChangeAuthor.jsx';
import DeckChangeDescription from './DeckChangeDescription.jsx';

function DeckInfo(props) {
  return (
    <>
      <DeckChangeName
        name={props.deck && props.deck.name}
        deckUpdate={props.deckUpdate}
        deckid={props.deck && props.deck.deckid}
        isAuthor={props.isAuthor}
      />
      <DeckChangeDescription
        description={props.deck && props.deck.description}
        deckUpdate={props.deckUpdate}
        deckid={props.deck && props.deck.deckid}
        isAuthor={props.isAuthor}
      />
      <DeckChangeAuthor
        author={props.deck && props.deck.author}
        deckUpdate={props.deckUpdate}
        deckid={props.deck && props.deck.deckid}
        isAuthor={props.isAuthor}
      />
    </>
  );
}

export default DeckInfo;
