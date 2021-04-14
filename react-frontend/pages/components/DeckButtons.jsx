import React from 'react';
import DeckDraw from './DeckDraw.jsx';
import DeckClone from './DeckClone.jsx';
import DeckDelete from './DeckDelete.jsx';
import DeckCopyUrlMutableButton from './DeckCopyUrlMutableButton.jsx';
import DeckCopyUrlCodedButton from './DeckCopyUrlCodedButton.jsx';
import DeckImport from './DeckImport.jsx';
import DeckExport from './DeckExport.jsx';
import DeckProxy from './DeckProxy.jsx';
import DeckMissing from './DeckMissing.jsx';
import DeckBranchCreate from './DeckBranchCreate.jsx';
import DeckBranchDelete from './DeckBranchDelete.jsx';

function DeckButtons(props) {
  return (
    <>
      {props.username && (
        <div className="button-block">
          <DeckImport
            setActiveDeck={props.setActiveDeck}
            getDecks={props.getDecks}
            setShowInfo={props.setShowInfo}
            setShowButtons={props.setShowButtons}
            isMobile={props.isMobile}
          />
        </div>
      )}
      {props.username && props.deck && (
        <div className="button-block">
          <DeckClone
            getDecks={props.getDecks}
            deck={props.deck}
            activeDeck={props.activeDeck}
            setActiveDeck={props.setActiveDeck}
            setShowButtons={props.setShowButtons}
            isMobile={props.isMobile}
          />
        </div>
      )}
      {props.deck && (
        <div className="button-block">
          <DeckExport
            deck={props.deck}
            activeDeck={props.activeDeck}
            setShowButtons={props.setShowButtons}
            username={props.username}
            isMobile={props.isMobile}
          />
        </div>
      )}
      {props.isAuthor && props.deck && (
        <div className="button-block">
          <DeckDelete
            deck={props.deck}
            getDecks={props.getDecks}
            setActiveDeck={props.setActiveDeck}
            setShowButtons={props.setShowButtons}
            isMobile={props.isMobile}
            history={props.history}
          />
        </div>
      )}
      {props.isAuthor && props.deck && (
        <div className="button-block">
          <DeckBranchCreate
            deck={props.deck}
            getDecks={props.getDecks}
            activeDeck={props.activeDeck}
            setActiveDeck={props.setActiveDeck}
            setShowButtons={props.setShowButtons}
            isMobile={props.isMobile}
          />
        </div>
      )}
      {props.isAuthor &&
        props.deck &&
        (props.deck.master ||
          (props.deck.branches && props.deck.branches.length > 0)) && (
          <div className="button-block">
            <DeckBranchDelete
              deck={props.deck}
              getDecks={props.getDecks}
              setActiveDeck={props.setActiveDeck}
              setShowButtons={props.setShowButtons}
              isMobile={props.isMobile}
            />
          </div>
        )}
      {props.deck && (
        <>
          {props.deck.deckid.length == 32 ? (
            <>
              <div className="button-block">
                <DeckCopyUrlMutableButton
                  value={props.activeDeck.deckid}
                  setShowButtons={props.setShowButtons}
                  isMobile={props.isMobile}
                />
              </div>
              <div className="button-block">
                <DeckCopyUrlCodedButton
                  deck={props.deck}
                  setShowButtons={props.setShowButtons}
                  isMobile={props.isMobile}
                />
              </div>
            </>
          ) : (
            <div className="button-block">
              <DeckCopyUrlMutableButton
                value={props.activeDeck.deckid}
                setShowButtons={props.setShowButtons}
                isMobile={props.isMobile}
              />
            </div>
          )}
        </>
      )}
      {props.deck && (
        <div className="button-block">
          <DeckProxy
            deck={props.deck}
            missingCrypt={props.missingCrypt}
            missingLibrary={props.missingLibrary}
            inventoryMode={props.inventoryMode}
            isMobile={props.isMobile}
            isWide={props.isWide}
            showImage={props.showImage}
            setShowImage={props.setShowImage}
            setShowInfo={props.setShowInfo}
            setShowButtons={props.setShowButtons}
          />
        </div>
      )}
      {props.deck && (
        <div className="button-block">
          <DeckDraw
            crypt={props.deck.crypt}
            library={props.deck.library}
            isMobile={props.isMobile}
            isWide={props.isWide}
            showImage={props.showImage}
            setShowImage={props.setShowImage}
            setShowButtons={props.setShowButtons}
          />
        </div>
      )}
      {props.deck && props.inventoryMode && (
        <div className="button-block">
          <DeckMissing
            name={props.deck.name}
            missingCrypt={props.missingCrypt}
            missingLibrary={props.missingLibrary}
            isMobile={props.isMobile}
            isWide={props.isWide}
            showImage={props.showImage}
            setShowImage={props.setShowImage}
            setShowButtons={props.setShowButtons}
            cryptCardBase={props.cryptCardBase}
            libraryCardBase={props.libraryCardBase}
          />
        </div>
      )}
    </>
  );
}

export default DeckButtons;
