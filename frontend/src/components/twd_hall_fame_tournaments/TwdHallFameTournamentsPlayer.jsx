import React from 'react';
import { Disclosure } from '@headlessui/react';
import TrophyFill from '@/assets/images/icons/trophy-fill.svg';
import StarFill from '@/assets/images/icons/star-fill.svg';
import { TwdHallFameDeckHeader } from '@/components';

const testStar = (eventName) => {
  return (
    RegExp(
      /(NAC|NC|EC|RESAC|SAC|ACC|Continental Championship) \d{4}( -- |$)/i,
      'i'
    ).test(eventName) ||
    RegExp(/(NAC|NC|EC) \d{4} Day 2$/i, 'i').test(eventName)
  );
};

const TwdHallFameTournamentsPlayer = ({ name, decks }) => {
  const getStars = (decks) => {
    let stars = 0;
    decks.map((deck) => {
      if (testStar(deck['event'])) {
        stars += 1;
      }
    });

    return stars;
  };

  const byDate = (a, b) => {
    return b.date - a.date;
  };

  const starsQty = getStars(decks);
  const stars = [];
  for (let i = 0; i < starsQty; i++) {
    stars.push(<StarFill key={i} height="13" width="12" viewBox="0 0 18 18" />);
  }

  return (
    <div className="rounded border border-borderPrimary bg-bgSecondary dark:border-borderPrimaryDark dark:bg-bgThirdDark">
      <Disclosure.Button className="w-full p-3">
        <div className="flex items-center space-x-4 px-2 text-fgName dark:text-fgNameDark">
          <div className="flex space-x-1">
            <div>{Object.keys(decks).length}</div>
            <div className="flex items-center">
              <TrophyFill width="13" height="13" viewBox="0 0 16 16" />
            </div>
          </div>
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <div>{name}</div>
            <div
              className="flex items-center"
              title="National or Continental Championships (in bold below)"
            >
              {stars}
            </div>
          </div>
        </div>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="space-y-1.5 px-2">
          {decks.sort(byDate).map((deck) => {
            return (
              <TwdHallFameDeckHeader
                key={deck.deckid}
                deck={{ ...deck, author: name }}
                isStar={testStar(deck['event'])}
              />
            );
          })}
        </div>
      </Disclosure.Panel>
    </div>
  );
};

export default TwdHallFameTournamentsPlayer;
