import React from 'react';
import { useSnapshot } from 'valtio';
import ArchiveFill from '@/assets/images/icons/archive-fill.svg?react';
import CalculatorFill from '@/assets/images/icons/calculator-fill.svg?react';
import { InventoryText, UsedDescription } from '@/components';
import { inventoryStore, usedStore, deckStore } from '@/context';
import { getHardTotal, getSoftMax } from '@/utils';

const ResultLayoutTextInventory = ({ card, inPopover }) => {
  const decks = useSnapshot(deckStore).decks;
  const inventoryCrypt = useSnapshot(inventoryStore).crypt;
  const inventoryLibrary = useSnapshot(inventoryStore).library;
  const usedCrypt = useSnapshot(usedStore).crypt;
  const usedLibrary = useSnapshot(usedStore).library;
  const usedCards = card.Id > 200000 ? usedCrypt : usedLibrary;
  const softUsedMax = getSoftMax(usedCards.soft[card.Id]);
  const hardUsedTotal = getHardTotal(usedCards.hard[card.Id]);
  const inInventory =
    card.Id > 200000
      ? inventoryCrypt[card.Id]?.q || 0
      : inventoryLibrary[card.Id]?.q || 0;
  const text =
    card.Id > 200000
      ? inventoryCrypt[card.Id]?.t
      : inventoryLibrary[card.Id]?.t;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`flex ${inPopover ? 'flex-col' : 'max-md:flex-col'} gap-1.5`}
      >
        <div className="flex flex-col basis-full md:basis-1/3 gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="opacity-40">
              <CalculatorFill width="14" height="14" viewBox="0 0 16 16" />
            </div>
            <b>{softUsedMax + hardUsedTotal}</b>
            <div>- Total Used</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="opacity-40">
              <ArchiveFill width="14" height="14" viewBox="0 0 16 16" />
            </div>
            <b>{inInventory}</b>
            <div>- In Inventory</div>
          </div>
        </div>
        <div className="flex flex-col basis-full md:basis-2/3 gap-0.5">
          {softUsedMax > 0 && (
            <UsedDescription
              usedCards={usedCards.soft[card.Id]}
              decks={decks}
              inventoryType="s"
            />
          )}
          {hardUsedTotal > 0 && (
            <UsedDescription
              usedCards={usedCards.hard[card.Id]}
              decks={decks}
              inventoryType="h"
            />
          )}
        </div>
      </div>
      <InventoryText text={text} card={card} inPopover={inPopover} />
    </div>
  );
};

export default ResultLayoutTextInventory;
