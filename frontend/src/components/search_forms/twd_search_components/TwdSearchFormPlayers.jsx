import React from 'react';
import Select from 'react-select';
import { useApp } from 'context';

const TwdSearchFormPlayers = ({ value, onChange }) => {
  const { isXWide } = useApp();
  const maxMenuHeight = isXWide ? 500 : 350;
  const name = 'players';
  const fromOptions = [];
  const toOptions = [];

  ['ANY', '100', '50', '30', '20', '10'].map((i) => {
    if (i === 'ANY' || value.to === 'any' || parseInt(i) < value.to) {
      fromOptions.push({
        value: i.toLowerCase(),
        name: 'from',
        label: (
          <>
            <span />
            {i}
          </>
        ),
      });
    }

    if (i === 'ANY' || value.from === 'any' || parseInt(i) > value.from) {
      toOptions.push({
        value: i.toLowerCase(),
        name: 'to',
        label: (
          <>
            <span />
            {i}
          </>
        ),
      });
    }
  });

  return (
    <>
      <div className=" flex flex-row items-center">
        <div className="inline  sm:basis-1/12" />
        <div className="inline basis-5/12 ">
          <Select
            classNamePrefix="react-select"
            options={fromOptions}
            isSearchable={false}
            name={name}
            maxMenuHeight={maxMenuHeight}
            value={fromOptions.find((obj) => obj.value === value.from)}
            onChange={onChange}
          />
        </div>
        <div className="flex basis-1/12 justify-center ">
          <div className=" text-xs">to</div>
        </div>
        <div className="inline basis-5/12 ">
          <Select
            classNamePrefix="react-select"
            options={toOptions}
            isSearchable={false}
            name={name}
            maxMenuHeight={maxMenuHeight}
            value={toOptions.find((obj) => obj.value === value.to)}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default TwdSearchFormPlayers;
