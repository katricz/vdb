import React from 'react';
import Select from 'react-select';
import { ResultLibraryClan } from 'components';
import {
  SearchAdditionalForms,
  SearchFormButtonLogicToggle,
  SearchFormButtonAdd,
  SearchFormButtonDel,
} from '../shared_search_components';
import imbuedClansList from 'assets/data/imbuedClansList.json';
import vampireClansList from 'assets/data/vampireClansList.json';
import { useApp } from 'context';

const CryptSearchFormClan = ({ value, searchForm, onChange }) => {
  const { isXWide, isMobile } = useApp();
  const maxMenuHeight = isXWide ? 500 : 350;
  const name = 'clan';
  const options = ['ANY', ...vampireClansList, ...imbuedClansList].map((i) => {
    if (i == 'ANY') {
      return {
        value: i.toLowerCase(),
        name: name,
        label: (
          <div className="flex items-center">
            <div className="flex w-[40px]" />
            {i}
          </div>
        ),
      };
    } else {
      return {
        value: i.toLowerCase(),
        name: name,
        label: (
          <div className="flex items-center">
            <div className="flex w-[40px] justify-center">
              <ResultLibraryClan value={i} />
            </div>
            {i}
          </div>
        ),
      };
    }
  });

  return (
    <>
      <div className=" flex flex-row items-center  ">
        <div className="basis-1/4 ">
          <div className="text-blue font-bold">Clan:</div>
          {value.value[0] !== 'any' && (
            <div className="flex justify-end ">
              <div>
                <SearchFormButtonLogicToggle
                  name={name}
                  value={value.logic}
                  searchForm={searchForm}
                />
              </div>
              {value.value.length == 1 ? (
                <SearchFormButtonAdd searchForm={searchForm} name={name} />
              ) : (
                <SearchFormButtonDel
                  searchForm={searchForm}
                  i={0}
                  name={name}
                />
              )}
            </div>
          )}
        </div>
        <div className="inline basis-9/12 ">
          <Select
            classNamePrefix="react-select"
            options={options}
            isSearchable={!isMobile}
            name={0}
            maxMenuHeight={maxMenuHeight}
            value={options.find(
              (obj) => obj.value === value.value[0].toLowerCase()
            )}
            onChange={onChange}
          />
        </div>
      </div>
      <SearchAdditionalForms
        value={value}
        name={name}
        searchForm={searchForm}
        options={options}
        onChange={onChange}
        maxMenuHeight={maxMenuHeight}
      />
    </>
  );
};

export default CryptSearchFormClan;
