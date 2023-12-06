import React, { useMemo } from 'react';
import Spellcheck from '@/assets/images/icons/spellcheck.svg?react';
import { SelectCreatable, ButtonIconed } from '@/components';
import { deckUpdate } from '@/context';
import { useTags } from '@/hooks';

const DeckTags = ({
  deck,
  tagsSuperior,
  noAutotags,
  isBordered,
  allTagsOptions,
}) => {
  const { deckid, tags, isPublic, isAuthor, isFrozen } = deck;
  const isEditable = isAuthor && !isPublic && !isFrozen;

  const tagList = useMemo(() => {
    const t = [];
    if (tagsSuperior) {
      tagsSuperior.map((tag) => {
        t.push({
          label: <b>{tag}</b>,
          value: tag,
        });
      });
    }

    if (tags) {
      tags.map((tag) => {
        t.push({
          label: tag,
          value: tag,
        });
      });
    }

    return t;
  }, [tags, tagsSuperior]);

  const handleChange = (event) => {
    const v = event.map((t) => t.value);
    deckUpdate(deckid, 'tags', v);
  };

  const handleAutotagClick = () => {
    const tags = useTags(deck.crypt, deck.library);
    deckUpdate(deckid, 'tags', [...tags.superior, ...tags.base]);
  };

  return (
    <div className="flex">
      <SelectCreatable
        className="w-full"
        noBorder={!isBordered}
        noRemove={!isEditable}
        isMulti
        isDisabled={!isEditable}
        options={allTagsOptions}
        onChange={handleChange}
        value={tagList}
        placeholder="Click to add tags"
        noOptionsMessage={() => 'Enter new tag'}
        roundedStyle={isEditable ? 'rounded-r-none rounded' : 'rounded'}
      />
      {!noAutotags && isEditable && (
        <ButtonIconed
          className="rounded-l-none"
          onClick={handleAutotagClick}
          title="Autotag Deck"
          icon={<Spellcheck width="22" height="23" viewBox="0 0 16 16" />}
        />
      )}
    </div>
  );
};

export default DeckTags;
