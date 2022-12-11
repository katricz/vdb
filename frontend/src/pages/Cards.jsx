import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowRepeat from 'assets/images/icons/arrow-repeat.svg';
import Dice3 from 'assets/images/icons/dice-3-fill.svg';
import {
  QuickSelect,
  ResultLayoutText,
  ButtonIconed,
  CardImage,
} from 'components';
import { useApp, setQuickCard } from 'context';

const Cards = () => {
  const params = useParams();
  const {
    cryptCardBase,
    libraryCardBase,
    showImage,
    toggleShowImage,
    isMobile,
    playtest,
  } = useApp();

  const [card, setCard] = useState();
  const [imageSet, setImageSet] = useState(null);
  const navigate = useNavigate();

  const handleSetCard = (card) => {
    navigate(`/cards/${card.Id}`);
  };

  const randomCrypt = () => {
    const cardid =
      Math.floor(
        Math.random() *
          Math.floor(
            Object.keys(cryptCardBase).filter(
              (cardid) => playtest || cardid < 210000
            ).length
          )
      ) + 200000;
    navigate(`/cards/${cardid}`);
  };

  const randomLibrary = () => {
    const cardid =
      Math.floor(
        Math.random() *
          Math.floor(
            Object.keys(libraryCardBase).filter(
              (cardid) => playtest || cardid < 110000
            ).length
          )
      ) + 100000;
    navigate(`/cards/${cardid}`);
  };

  useEffect(() => {
    if (cryptCardBase && libraryCardBase) {
      setQuickCard(params.cardid);
      setCard(
        params.cardid > 200000
          ? cryptCardBase[params.cardid]
          : libraryCardBase[params.cardid]
      );
    }
  }, [params.cardid, cryptCardBase, libraryCardBase]);

  return (
    <div className="cards-container  mx-auto ">
      <>
        {isMobile ? (
          <>
            {card && (
              <>
                <div className=" flex flex-row">
                  <div className="m-0">
                    {showImage ? (
                      <CardImage
                        className="h-auto w-full"
                        card={card}
                        set={imageSet}
                      />
                    ) : (
                      <>
                        <div className=" ">
                          <ResultLayoutText
                            card={card}
                            setImageSet={setImageSet}
                            noClose={true}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => toggleShowImage()}
                  className="float-right-bottom float-turn flex items-center justify-center"
                >
                  <ArrowRepeat viewBox="0 0 16 16" />
                </div>
              </>
            )}
            <div className="fixed bottom-[40px]  flex w-full flex-row  ">
              <div className=" md:basis-8/12">
                <QuickSelect
                  selectedCardid={card && card.Id}
                  setCard={handleSetCard}
                />
              </div>
            </div>
            <div
              onClick={() => randomCrypt()}
              className="float-right-top float-random flex items-center justify-center"
            >
              <Dice3 viewBox="0 0 16 16" /> C
            </div>
            <div
              onClick={() => randomLibrary()}
              className="float-right-middle float-random flex items-center justify-center"
            >
              <Dice3 viewBox="0 0 16 16" /> L
            </div>
          </>
        ) : (
          <div className="flex flex-row">
            <div className="md={{ span: 8, offset: 2 }} quick-cards">
              {cryptCardBase && libraryCardBase && (
                <div className="align-justify-center flex flex-row justify-center ">
                  <div>
                    <QuickSelect
                      selectedCardid={card && card.Id}
                      setCard={handleSetCard}
                    />
                  </div>
                </div>
              )}
              {card && (
                <div className="align-justify-center bordered  flex flex-row justify-center">
                  <div className=" md:basis-1/2">
                    <CardImage
                      className="h-auto w-full"
                      card={card}
                      set={imageSet}
                    />
                  </div>
                  <div className=" md:basis-1/2">
                    <ResultLayoutText
                      card={card}
                      setImageSet={setImageSet}
                      setCard={handleSetCard}
                      noClose
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-col space-y-1">
                <ButtonIconed
                  variant="secondary"
                  onClick={() => randomCrypt()}
                  title="Random Crypt Card"
                  icon={<Dice3 />}
                  text="Crypt"
                />
                <ButtonIconed
                  variant="secondary"
                  onClick={() => randomLibrary()}
                  title="Random Library Card"
                  icon={<Dice3 />}
                  text="Library"
                />
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Cards;
