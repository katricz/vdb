import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Diagram3Fill from '../../assets/images/icons/diagram-3-fill.svg'
import LockFill from '../../assets/images/icons/lock-fill.svg'
import ArchiveFill from '../../assets/images/icons/archive-fill.svg'
import ResultCryptPopover from './ResultCryptPopover.jsx';
import DeckCardQuantity from './DeckCardQuantity.jsx';
import ResultCryptCapacity from './ResultCryptCapacity.jsx';
import ResultCryptDisciplines from './ResultCryptDisciplines.jsx';
import ResultCryptName from './ResultCryptName.jsx';
import ResultCryptClan from './ResultCryptClan.jsx';
import ResultCryptGroup from './ResultCryptGroup.jsx';
import ResultAddCard from './ResultAddCard.jsx';
import ResultCryptModal from './ResultCryptModal.jsx';

function ResultCryptTable(props) {
  let resultTrClass;

  const [modalCard, setModalCard] = useState(undefined);
  const [modalUsedDescription, setModalUsedDescription] = useState(undefined)

  const cardRows = props.resultCards.map((card, index) => {
    let q;
    if (props.className == 'deck-crypt-table') {
      q = card.q;
      card = card.c;
    }

    if (resultTrClass == 'result-odd') {
      resultTrClass = 'result-even';
    } else {
      resultTrClass = 'result-odd';
    }

    let inDeck;
    if (props.crypt) {
      Object.keys(props.crypt).map((i, index) => {
        if (i == card['Id']) {
          inDeck = props.crypt[i].q;
        }
      });
    }

    let inInventory = null;
    if (props.inventoryMode) {
      if (Object.keys(props.inventoryCrypt).includes(card['Id'].toString())) {
        inInventory = props.inventoryCrypt[card['Id']].q;
      } else {
        inInventory = 0;
      }
    }

    let softUsedMax = 0;
    let SoftUsedDescription;
    if (props.usedCards.soft[card['Id']]) {
      SoftUsedDescription = Object.keys(props.usedCards.soft[card['Id']]).map((id, index) => {
        if (softUsedMax < props.usedCards.soft[card['Id']][id]) {
          softUsedMax = props.usedCards.soft[card['Id']][id];
        }

        return (
          <div className="d-flex align-items-center" key={index}>
            <div className="opacity-035"><Diagram3Fill/></div>
            <div className="px-1"><b>{props.usedCards.soft[card['Id']][id]}</b></div>
            - {props.decks[id]['name']}
          </div>
        );
      });
    }

    let hardUsedTotal = 0;
    let HardUsedDescription;
    if (props.usedCards.hard[card['Id']]) {
      HardUsedDescription = Object.keys(props.usedCards.hard[card['Id']]).map((id, index) => {
        hardUsedTotal += props.usedCards.hard[card['Id']][id];
        return (
          <div className="d-flex align-items-center" key={index}>
            <div className="opacity-035"><LockFill/></div>
            <div className="px-1"><b>{props.usedCards.hard[card['Id']][id]}</b></div>
            - {props.decks[id]['name']}
          </div>
        );
      });
    }

    const UsedPopover = React.forwardRef(({ children, ...props }, ref) => {
      return (
        <Popover ref={ref} {...props}>
          <Popover.Content>
            <>
              {children == 0 ?
               <div className="py-1">
                 Not used in inventory decks
               </div>
               :
               <>
                 {softUsedMax > 0 && <>{SoftUsedDescription}</>}
                 {hardUsedTotal > 0 && <>{HardUsedDescription}</>}
               </>
              }
              <hr/>
              <div className="d-flex align-items-center" key={index}>
                <div className="opacity-035"><ArchiveFill/></div>
                <div className="px-1"><b>{inInventory}</b></div>
                - In Inventory
              </div>
            </>
          </Popover.Content>
        </Popover>
      );
    });
    UsedPopover.displayName = 'UsedPopover';


    const CardPopover = React.forwardRef(({ children, ...props }, ref) => {
      return (
        <Popover ref={ref} {...props}>
          <Popover.Content>
            <ResultCryptPopover card={props.card} showImage={children} />
          </Popover.Content>
        </Popover>
      );
    });
    CardPopover.displayName = 'CardPopover';

    return (
      <React.Fragment key={index}>
        <tr className={resultTrClass}>
          {props.proxySelected && (
            <td className="proxy-selector">
              <div className="custom-control custom-checkbox">
                <input
                  id={card['Id']}
                  name="print"
                  className="custom-control-input"
                  type="checkbox"
                  checked={
                    props.proxySelected[card['Id']]
                      ? props.proxySelected[card['Id']].print
                      : false
                  }
                  onChange={(e) => props.proxySelector(e)}
                />
                <label htmlFor={card['Id']} className="custom-control-label" />
              </div>
            </td>
          )}
          {props.className == 'deck-crypt-table' ? (
            <>
              {props.isAuthor ? (
                <>
                  {props.inventoryMode ? (
                    <OverlayTrigger
                      placement={props.placement ? props.placement : 'right'}
                      overlay={
                        <UsedPopover>{softUsedMax || hardUsedTotal}</UsedPopover>
                      }
                    >
                      <td className="quantity">
                        <DeckCardQuantity
                          cardid={card['Id']}
                          q={q}
                          deckid={props.deckid}
                          cardChange={props.cardChange}
                          isMobile={props.isMobile}
                          inInventory={inInventory}
                          softUsedMax={softUsedMax}
                          hardUsedTotal={hardUsedTotal}
                        />
                      </td>
                    </OverlayTrigger>
                  )
                   :
                   <td className="quantity">
                     <DeckCardQuantity
                       cardid={card['Id']}
                       q={q}
                       deckid={props.deckid}
                       cardChange={props.cardChange}
                       isMobile={props.isMobile}
                     />
                   </td>
                  }
                </>
              ) : props.proxySelected ? (
                <td className="quantity">
                  <DeckCardQuantity
                    cardid={card['Id']}
                    deckid={null}
                    q={
                      props.proxySelected[card['Id']]
                        ? props.proxySelected[card['Id']].q
                        : 0
                    }
                    cardChange={props.proxyCounter}
                    isMobile={props.isMobile}
                  />
                </td>
              ) : q ? (
                <td className="quantity-no-buttons px-2">{q}</td>
              ) : (
                <td className="quantity-no-buttons px-2">
                  <div className="transparent">0</div>
                </td>
              )}
            </>
          ) : (
            <>
              {props.addMode && (
                <td className="quantity">
                  <ResultAddCard
                    cardAdd={props.cardAdd}
                    cardid={card['Id']}
                    card={card}
                    inDeck={inDeck}
                  />
                </td>
              )}
              {props.inventoryMode && (
                <>
                  <OverlayTrigger
                    placement={props.placement ? props.placement : 'right'}
                    overlay={
                      <UsedPopover>{softUsedMax || hardUsedTotal}</UsedPopover>
                    }
                  >
                    <td className="quantity px-1">
                      <div className={inInventory < softUsedMax + hardUsedTotal ? "quantity px-1 mx-1 bg-red" : "quantity px-1"}>
                        {inInventory}
                      </div>
                    </td>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement={props.placement ? props.placement : 'right'}
                    overlay={
                      <UsedPopover>{softUsedMax || hardUsedTotal}</UsedPopover>
                    }
                  >
                    <td className="used">
                      { softUsedMax > 0 &&
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="d-inline opacity-035 pr-1"><Diagram3Fill/></div>{softUsedMax}
                        </div>
                      }
                      { hardUsedTotal > 0 &&
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="d-inline opacity-035 pr-1"><LockFill/></div>{hardUsedTotal}
                        </div>
                      }
                    </td>
                  </OverlayTrigger>
                </>
              )}
            </>
          )}
          <td className="capacity pr-1 pl-2" onClick={() => setModalCard(card)}>
            <ResultCryptCapacity value={card['Capacity']} />
          </td>
          <td
            className={
              props.keyDisciplines + props.nonKeyDisciplines < 8
                ? `disciplines cols-${
                    props.keyDisciplines + props.nonKeyDisciplines
                  } px-1`
                : 'disciplines px-1'
            }
            onClick={() => setModalCard(card)}
          >
            <ResultCryptDisciplines
              value={card['Disciplines']}
              disciplinesSet={props.disciplinesSet}
              keyDisciplines={props.keyDisciplines}
              nonKeyDisciplines={props.nonKeyDisciplines}
              isMobile={props.isMobile}
            />
          </td>
          {!props.isMobile ?
           <OverlayTrigger
             placement={props.placement ? props.placement : 'right'}
             overlay={
               <CardPopover card={card}>{props.showImage}</CardPopover>
             }
           >
             <td className="name px-1" onClick={() => {
               setModalCard(card);
               setModalUsedDescription({soft: SoftUsedDescription, hard: HardUsedDescription});
             }
                                               }>
               <ResultCryptName card={card} />
             </td>
           </OverlayTrigger>
           :
           <td className="name px-1" onClick={() => setModalCard(card)}>
             <ResultCryptName card={card} />
           </td>
          }
          {props.isMobile || !props.isWide ? (
            <td className="clan-group" onClick={() => setModalCard(card)}>
              <div>
                <ResultCryptClan value={card['Clan']} />
              </div>
              <div className="d-flex small justify-content-end">
                <ResultCryptGroup value={card['Group']} />
              </div>
            </td>
          ) : (
            <>
              <td className="clan" onClick={() => setModalCard(card)}>
                <ResultCryptClan value={card['Clan']} />
              </td>
              <td className="group" onClick={() => setModalCard(card)}>
                <ResultCryptGroup value={card['Group']} />
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
      {modalCard && (
        <ResultCryptModal
          show={modalCard ? true : false}
          card={modalCard}
          usedDescription={modalUsedDescription}
          showImage={props.showImage}
          setShowImage={props.setShowImage}
          handleClose={() => setModalCard(false)}
          isMobile={props.isMobile}
          inventoryMode={props.inventoryMode}
        />
      )}
    </>
  );
}

export default ResultCryptTable;
