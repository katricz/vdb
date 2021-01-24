import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import EyeFill from '../assets/images/icons/eye-fill.svg';
import EyeSlashFill from '../assets/images/icons/eye-slash-fill.svg';
import AlertMessage from './components/AlertMessage.jsx';
import ResultLibrary from './components/ResultLibrary.jsx';
import SearchLibraryForm from './components/SearchLibraryForm.jsx';
import DeckSelect from './components/DeckSelect.jsx';
import DeckCrypt from './components/DeckCrypt.jsx';
import DeckLibrary from './components/DeckLibrary.jsx';

function Library(props) {
  const [sortMethod, setSortMethod] = useState('Type');

  return (
    <Container className="main-container">
      <Row>
        {!props.isMobile && (
          <Col md={12} xl={4} className="px-0">
            {Object.keys(props.decks).length > 0 && (
              <Row>
                <Col className="pr-0">
                  <DeckSelect
                    decks={props.decks}
                    activeDeck={props.activeDeck}
                    setActiveDeck={props.setActiveDeck}
                  />
                </Col>
                <Col xs="auto" className="d-flex pl-0">
                  <Button
                    variant="outline-secondary"
                    onClick={() => props.setShowDeck(!props.showDeck)}
                  >
                    {props.showDeck ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                </Col>
              </Row>
            )}
            {props.activeDeck && props.showDeck && (
              <>
                <DeckCrypt
                  changeTimer={props.changeTimer}
                  deckCardAdd={props.deckCardAdd}
                  deckCardChange={props.deckCardChange}
                  deckid={props.activeDeck}
                  cards={props.decks[props.activeDeck].crypt}
                  showImage={props.showImage}
                  setShowImage={props.setShowImage}
                  isAuthor={true}
                  isMobile={props.isMobile}
                  isWide={props.isWide}
                  cardBase={props.cryptCardBase}
                />
                <DeckLibrary
                  deckCardAdd={props.deckCardAdd}
                  deckCardChange={props.deckCardChange}
                  deckid={props.activeDeck}
                  cards={props.decks[props.activeDeck].library}
                  showImage={props.showImage}
                  setShowImage={props.setShowImage}
                  isAuthor={true}
                  isMobile={props.isMobile}
                  cardBase={props.libraryCardBase}
                />
              </>
            )}
          </Col>
        )}
        <Col
          md={12}
          xl={5}
          className={
            !(props.isMobile && props.showSearch)
              ? 'px-0 px-lg-4'
              : 'col-hide px-0 lx-lg-4'
          }
        >
          {props.results && (
            <ResultLibrary
              showImage={props.showImage}
              setShowImage={props.setShowImage}
              deckCardAdd={props.deckCardAdd}
              cards={props.results}
              library={
                props.decks &&
                props.decks[props.activeDeck] &&
                props.decks[props.activeDeck].library
              }
              activeDeck={props.activeDeck}
              sortMethod={sortMethod}
              setSortMethod={setSortMethod}
              isMobile={props.isMobile}
              isWide={props.isWide}
              addMode={props.addMode}
              setAddMode={props.setAddMode}
              showSearch={props.showSearch}
              setShowSearch={props.setShowSearch}
              setResults={props.setResults}
            />
          )}
        </Col>
        <Col
          md={12}
          xl={3}
          className={
            !props.isMobile || (props.isMobile && props.showSearch)
              ? 'px-0'
              : 'col-hide px-0'
          }
        >
          {props.isMobile && props.results === null && (
            <AlertMessage className="error-message">
              <b>NO CARDS FOUND</b>
            </AlertMessage>
          )}
          <SearchLibraryForm
            results={props.results}
            setResults={props.setResults}
            showSearch={props.showSearch}
            setShowSearch={props.setShowSearch}
            formState={props.formState}
            setFormState={props.setFormState}
            isMobile={props.isMobile}
            cardBase={props.libraryCardBase}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Library;
