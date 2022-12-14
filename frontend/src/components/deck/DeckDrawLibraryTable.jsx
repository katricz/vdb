import React, { useState } from 'react';
import {
  CardPopover,
  Tooltip,
  ResultLibraryBurn,
  ResultLibraryClan,
  ResultLibraryCost,
  ResultLibraryDisciplines,
  ResultLibraryName,
  ResultLibraryTrifle,
  ResultLibraryTypeImage,
  DeckDrawProbabilityText,
  DeckDrawProbabilityModal,
  ConditionalTooltip,
} from 'components';
import { isTrifle, drawProbability } from 'utils';
import { useApp } from 'context';

const DeckDrawLibraryTable = ({
  handleClick,
  restCards,
  resultCards,
  ashHeap,
  placement,
}) => {
  const { isMobile } = useApp();
  const [modalDraw, setModalDraw] = useState(undefined);

  let N = 0;
  let n = 0;
  const nonPlayed = {};

  if (restCards && resultCards) {
    N = restCards.length + resultCards.length;
    n = resultCards.length;

    [...restCards, ...resultCards].forEach((c) => {
      if (c.Id in nonPlayed) {
        nonPlayed[c.Id] += 1;
      } else {
        nonPlayed[c.Id] = 1;
      }
    });
  }

  const cardRows = resultCards.map((card, idx) => {
    const k = nonPlayed[card.Id];

    return (
      <React.Fragment key={`${idx}-${card.Id}`}>
        <tr className={`result-${idx % 2 ? 'even' : 'odd'}`}>
          <td
            className={card['Blood Cost'] ? 'cost blood ' : 'cost '}
            onClick={() => handleClick(idx)}
          >
            {(card['Blood Cost'] || card['Pool Cost']) && (
              <ResultLibraryCost
                valueBlood={card['Blood Cost']}
                valuePool={card['Pool Cost']}
              />
            )}
          </td>
          <td className="type " onClick={() => handleClick(idx)}>
            <ResultLibraryTypeImage value={card.Type} />
          </td>
          <td className="disciplines " onClick={() => handleClick(idx)}>
            {card.Clan && <ResultLibraryClan value={card.Clan} />}
            {card.Discipline && card.Clan && '+'}
            {card.Discipline && (
              <ResultLibraryDisciplines value={card.Discipline} />
            )}
          </td>
          <td className="name " onClick={() => handleClick(idx)}>
            <ConditionalTooltip
              overlay={<CardPopover card={card} />}
              disabled={isMobile}
              placement={placement}
            >
              <ResultLibraryName card={card} />
            </ConditionalTooltip>
          </td>
          <td className="burn " onClick={() => handleClick(idx)}>
            {card['Burn Option'] && <ResultLibraryBurn />}
            {isTrifle(card) && <ResultLibraryTrifle />}
          </td>
          <td className="text-blue w-9  text-right">
            {!ashHeap && (
              <>
                {isMobile ? (
                  <div
                    onClick={() =>
                      setModalDraw({
                        name: card['Name'],
                        prob: <DeckDrawProbabilityText N={N} n={n} k={k} />,
                      })
                    }
                  >
                    {`${Math.floor(drawProbability(1, N, n, k) * 100)}%`}
                  </div>
                ) : (
                  <Tooltip
                    placement={placement}
                    text={<DeckDrawProbabilityText N={N} n={n} k={k} />}
                  >
                    <div>{`${Math.floor(
                      drawProbability(1, N, n, k) * 100
                    )}%`}</div>
                  </Tooltip>
                )}
              </>
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  });

  return (
    <>
      <table className="search-library-table">
        <tbody>{cardRows}</tbody>
      </table>
      {modalDraw && (
        <DeckDrawProbabilityModal
          modalDraw={modalDraw}
          setModalDraw={setModalDraw}
        />
      )}
    </>
  );
};

export default DeckDrawLibraryTable;
