import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import {
  CardPopover,
  UsedPopover,
  ResultCryptCapacity,
  ResultCryptDisciplines,
  ResultCryptName,
  ResultClanImage,
  ResultCryptGroup,
  ResultCryptTitle,
  ButtonAddCard,
  ResultCryptModal,
  ConditionalOverlayTrigger,
} from 'components';
import { useApp } from 'context';

function ResultCryptTable(props) {
  const {
    activeDeck,
    inventoryCrypt,
    usedCryptCards,
    addMode,
    inventoryMode,
    isMobile,
    isDesktop,
    isWide,
  } = useApp();

  const [modalCardIdx, setModalCardIdx] = useState(undefined);

  let resultTrClass;
  let maxDisciplines = 0;
  props.resultCards.map((card) => {
    const n = Object.keys(card['Disciplines']).length;
    if (maxDisciplines < n) {
      maxDisciplines = n;
    }
  });

  const handleModalCardChange = (d) => {
    const maxIdx = props.resultCards.length - 1;

    if (modalCardIdx + d < 0) {
      setModalCardIdx(maxIdx);
    } else if (modalCardIdx + d > maxIdx) {
      setModalCardIdx(0);
    } else {
      setModalCardIdx(modalCardIdx + d);
    }
  };

  const cardRows = props.resultCards.map((card, index) => {
    const handleClick = () => {
      setModalCardIdx(index);
      isMobile && props.setShowFloatingButtons(false);
    };

    if (resultTrClass == 'result-odd') {
      resultTrClass = 'result-even';
    } else {
      resultTrClass = 'result-odd';
    }

    const inDeck =
      (props.crypt && props.crypt[card['Id']] && props.crypt[card['Id']].q) ||
      0;

    let softUsedMax = 0;
    let hardUsedTotal = 0;

    let inInventory = 0;
    if (inventoryMode) {
      if (inventoryCrypt[card['Id']]) {
        inInventory = inventoryCrypt[card['Id']].q;
      }

      if (usedCryptCards.soft[card['Id']]) {
        Object.keys(usedCryptCards.soft[card['Id']]).map((id) => {
          if (softUsedMax < usedCryptCards.soft[card['Id']][id]) {
            softUsedMax = usedCryptCards.soft[card['Id']][id];
          }
        });
      }

      if (usedCryptCards.hard[card['Id']]) {
        Object.keys(usedCryptCards.hard[card['Id']]).map((id) => {
          hardUsedTotal += usedCryptCards.hard[card['Id']][id];
        });
      }
    }

    return (
      <React.Fragment key={card['Id']}>
        <tr className={resultTrClass}>
          {!props.notAuthor && activeDeck.deckid && addMode && (
            <td className="quantity-add pe-1">
              <ButtonAddCard
                cardid={card['Id']}
                deckid={props.activeDeck.deckid}
                card={card}
                inDeck={inDeck}
              />
            </td>
          )}
          {inventoryMode && (
            <OverlayTrigger
              placement={isDesktop ? 'left' : 'right'}
              overlay={<UsedPopover cardid={card['Id']} />}
            >
              <td className="used">
                {(inInventory > 0 || softUsedMax + hardUsedTotal > 0) && (
                  <div
                    className={`d-flex align-items-center justify-content-between used px-1 ms-1 ${
                      inInventory < softUsedMax + hardUsedTotal
                        ? 'inv-miss-full'
                        : ''
                    }
                  `}
                  >
                    {inInventory}
                    <div
                      className={`small ${
                        inInventory >= softUsedMax + hardUsedTotal
                          ? 'gray'
                          : 'white'
                      } ps-1`}
                    >
                      {inInventory >= softUsedMax + hardUsedTotal
                        ? `+${inInventory - softUsedMax - hardUsedTotal}`
                        : inInventory - softUsedMax - hardUsedTotal}
                    </div>
                  </div>
                )}
              </td>
            </OverlayTrigger>
          )}
          <td
            className={isMobile ? 'capacity px-1' : 'capacity px-2'}
            onClick={() => handleClick()}
          >
            <ResultCryptCapacity value={card['Capacity']} />
          </td>
          <td className="disciplines" onClick={() => handleClick()}>
            <ResultCryptDisciplines
              maxDisciplines={maxDisciplines}
              value={card['Disciplines']}
            />
          </td>
          <ConditionalOverlayTrigger
            placement={props.placement}
            overlay={<CardPopover card={card} />}
            disabled={isMobile}
          >
            <td className="name px-2" onClick={() => handleClick()}>
              <ResultCryptName card={card} />
            </td>
          </ConditionalOverlayTrigger>
          {isWide ? (
            <>
              <td className="title pe-2" onClick={() => handleClick()}>
                <ResultCryptTitle value={card['Title']} />
              </td>
              <td className="clan" onClick={() => handleClick()}>
                <ResultClanImage value={card['Clan']} />
              </td>
              <td className="group" onClick={() => handleClick()}>
                <ResultCryptGroup value={card['Group']} />
              </td>
            </>
          ) : (
            <>
              <td className="clan-group" onClick={() => handleClick()}>
                <div>
                  <ResultClanImage value={card['Clan']} />
                </div>
                <div className="d-flex small justify-content-end">
                  <div className="bold blue">
                    <ResultCryptTitle value={card['Title']} />
                  </div>
                  <ResultCryptGroup value={card['Group']} />
                </div>
              </td>
            </>
          )}
        </tr>
      </React.Fragment>
    );
  });

  return (
    <>
      <table className={props.className}>
        <tbody>{cardRows}</tbody>
      </table>
      {modalCardIdx !== undefined && (
        <ResultCryptModal
          card={props.resultCards[modalCardIdx]}
          handleModalCardChange={handleModalCardChange}
          handleClose={() => {
            setModalCardIdx(undefined);
            isMobile && props.setShowFloatingButtons(true);
          }}
        />
      )}
    </>
  );
}

export default ResultCryptTable;
