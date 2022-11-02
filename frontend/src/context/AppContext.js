import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { initFromStorage, setLocalStorage } from 'services/storageServices.js';
import { cardServices } from 'services';
import { useDeck, useWindowSize } from 'hooks';
import {
  setInventoryCrypt,
  setInventoryLibrary,
  setUsedCrypt,
  setUsedLibrary,
} from 'context';
import { byTimestamp } from 'utils';
import { deckStore } from 'context';

const AppContext = React.createContext();

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error(`useApp must be used within a AppProvider`);

  return context;
};

export const AppProvider = (props) => {
  const screenSize = useWindowSize();
  const isMobile = useMemo(() => screenSize <= 767, [screenSize]);
  const isNarrow = useMemo(() => screenSize <= 992, [screenSize]);
  const isDesktop = useMemo(() => screenSize >= 1200, [screenSize]);
  const isWide = useMemo(() => screenSize >= 1440, [screenSize]);
  const isXWide = useMemo(() => screenSize >= 1920, [screenSize]);

  const [username, setUsername] = useState();
  const [publicName, setPublicName] = useState();
  const [email, setEmail] = useState();
  const [inventoryKey, setInventoryKey] = useState();
  const [lang, setLang] = useState('en-EN');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPlaytestAdmin, setIsPlaytestAdmin] = useState();
  const [isPlaytester, setIsPlaytester] = useState();
  const [playtest, setPlaytest] = useState();
  const [showImage, setShowImage] = useState();
  const [addMode, setAddMode] = useState();
  const [inventoryMode, setInventoryMode] = useState();
  const [hideMissing, setHideMissing] = useState();
  const [cryptDeckSort, setCryptDeckSort] = useState();
  const [cryptSearchSort, setCryptSearchSort] = useState();
  const [librarySearchSort, setLibrarySearchSort] = useState();
  const [twdSearchSort, setTwdSearchSort] = useState();
  const [pdaSearchSort, setPdaSearchSort] = useState();

  const [cryptCardBase, setCryptCardBase] = useState();
  const [libraryCardBase, setLibraryCardBase] = useState();
  const [nativeCrypt, setNativeCrypt] = useState();
  const [nativeLibrary, setNativeLibrary] = useState();
  const [localizedCrypt, setLocalizedCrypt] = useState();
  const [localizedLibrary, setLocalizedLibrary] = useState();

  const [preconDecks, setPreconDecks] = useState();

  const [showCryptSearch, setShowCryptSearch] = useState(true);
  const [showLibrarySearch, setShowLibrarySearch] = useState(true);

  const decks = useSnapshot(deckStore).decks;
  const [lastDeckId, setLastDeckId] = useState();
  const [recentDecks, setRecentDecks] = useState([]);

  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [showMenuButtons, setShowMenuButtons] = useState();

  // CARD BASE
  useEffect(() => {
    cardServices.getCardBase().then((data) => {
      setCryptCardBase(data.crypt);
      setLibraryCardBase(data.library);
      setNativeCrypt(data.nativeCrypt);
      setNativeLibrary(data.nativeLibrary);
      setLocalizedCrypt({ 'en-EN': data.nativeCrypt });
      setLocalizedLibrary({ 'en-EN': data.nativeLibrary });
    });
  }, []);

  // USER
  const whoAmI = () => {
    const url = `${process.env.API_URL}account`;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => initializeUserData(data))
      .catch(() => initializeUnauthenticatedUser());
  };

  const initializeUserData = (data) => {
    const inventory = parseInventoryData(data.inventory);
    setUsername(data.username);
    setPublicName(data.public_name);
    setEmail(data.email);
    setInventoryKey(data.inventory_key);
    setIsPlaytester(data.playtester);
    setIsPlaytestAdmin(data.playtest_admin);
    if (!data.playtester && !data.playtest_admin) setPlaytest(false);
    setInventoryCrypt(inventory.crypt);
    setInventoryLibrary(inventory.library);
    deckStore.decks = parseDecksData(data.decks);
  };

  const initializeUnauthenticatedUser = () => {
    setAddMode(false);
    setInventoryMode(false);
    setIsPlaytester(false);
    setIsPlaytestAdmin(false);
    setPlaytest(false);
    setInventoryCrypt({});
    setInventoryLibrary({});
    setUsername(null);
    setEmail(undefined);
    deckStore.deck = undefined;
    deckStore.decks = {};
  };

  useEffect(() => {
    if (cryptCardBase && libraryCardBase) {
      whoAmI();
      setPreconDecks(
        cardServices.getPreconDecks(cryptCardBase, libraryCardBase)
      );
    }
  }, [cryptCardBase, libraryCardBase]);

  // LANGUAGE
  const changeLang = (lang) => {
    setLang(lang);
    setLocalStorage('lang', lang);
  };

  const changeBaseTextToLocalizedText = (
    setCardBase,
    localizedInfo,
    nativeInfo
  ) => {
    setCardBase((prevState) => {
      const newState = { ...prevState };
      Object.keys(prevState).map((k) => {
        const newInfo = localizedInfo[k] ? localizedInfo[k] : nativeInfo[k];
        newState[k]['Name'] = newInfo['Name'];
        newState[k]['Card Text'] = newInfo['Card Text'];
      });
      return newState;
    });
  };

  const initializeLocalizedInfo = async (lang) => {
    cardServices.getLocalizedCardBase(lang).then((data) => {
      setLocalizedCrypt((prevState) => ({
        ...prevState,
        [lang]: data.crypt,
      }));
      setLocalizedLibrary((prevState) => ({
        ...prevState,
        [lang]: data.library,
      }));
      changeBaseTextToLocalizedText(setCryptCardBase, data.crypt, nativeCrypt);
      changeBaseTextToLocalizedText(
        setLibraryCardBase,
        data.library,
        nativeLibrary
      );
    });
  };

  useEffect(() => {
    async function triggerLangChange() {
      if (!localizedCrypt[lang] || !localizedLibrary[lang]) {
        await initializeLocalizedInfo(lang);
      } else {
        changeBaseTextToLocalizedText(
          setCryptCardBase,
          localizedCrypt[lang],
          nativeCrypt
        );
        changeBaseTextToLocalizedText(
          setLibraryCardBase,
          localizedLibrary[lang],
          nativeLibrary
        );
      }
    }
    if (cryptCardBase && libraryCardBase) {
      triggerLangChange();
    }
  }, [lang, nativeCrypt, nativeLibrary]);

  // APP DATA
  const toggleShowImage = () => {
    setShowImage(!showImage);
    setLocalStorage('showImage', !showImage);
  };

  const toggleInventoryMode = () => {
    setInventoryMode(!inventoryMode);
    setLocalStorage('inventoryMode', !inventoryMode);
  };

  const changeCryptDeckSort = (method) => {
    setCryptDeckSort(method);
    setLocalStorage('cryptDeckSort', method);
  };

  const changeCryptSearchSort = (method) => {
    setCryptSearchSort(method);
    setLocalStorage('cryptSearchSort', method);
  };

  const changeLibrarySearchSort = (method) => {
    setLibrarySearchSort(method);
    setLocalStorage('librarySearchSort', method);
  };

  const changeTwdSearchSort = (method) => {
    setTwdSearchSort(method);
    setLocalStorage('twdSearchSort', method);
  };

  const changePdaSearchSort = (method) => {
    setPdaSearchSort(method);
    setLocalStorage('pdaSearchSort', method);
  };

  const toggleAddMode = () => {
    setAddMode(!addMode);
    setLocalStorage('addMode', !addMode);
  };

  const togglePlaytest = () => {
    setPlaytest(!playtest);
    setLocalStorage('playtest', !playtest);
  };

  const addRecentDeck = (deck) => {
    const src =
      deck.deckid.length != 32 ? 'twd' : deck.publicParent ? 'pda' : 'shared';
    let d = [...recentDecks];
    const idx = recentDecks.map((v) => v.deckid).indexOf(deck.deckid);
    if (idx !== -1) d.splice(idx, 1);
    d.unshift({
      deckid: deck.deckid,
      name: deck.name,
      src: src,
    });
    if (d.length > 10) d = d.slice(0, 10);
    setRecentDecks(d);
    setLocalStorage('recentDecks', d);
  };

  const updateRecentDecks = (decks) => {
    setRecentDecks(decks);
    setLocalStorage('recentDecks', decks);
  };

  useEffect(() => {
    window.addEventListener('offline', () => setIsOnline(false));
    window.addEventListener('online', () => setIsOnline(true));

    return () => {
      window.removeEventListener('offline', () => setIsOnline(false));
      window.removeEventListener('online', () => setIsOnline(true));
    };
  }, []);

  useLayoutEffect(() => {
    initFromStorage(
      'cryptSearchSort',
      'Capacity - Min to Max',
      setCryptSearchSort
    );
    initFromStorage('cryptDeckSort', 'Quantity', setCryptDeckSort);
    initFromStorage('librarySearchSort', 'Type', setLibrarySearchSort);
    initFromStorage('twdSearchSort', 'Date - New to Old', setTwdSearchSort);
    initFromStorage('pdaSearchSort', 'Date - New to Old', setPdaSearchSort);
    initFromStorage('lang', 'en-EN', setLang);
    initFromStorage('addMode', isDesktop ? true : false, setAddMode);
    initFromStorage('inventoryMode', false, setInventoryMode);
    initFromStorage('showImage', true, setShowImage);
    initFromStorage('recentDecks', [], setRecentDecks);
    initFromStorage('playtest', false, setPlaytest);
  }, []);

  // DECKS
  const parseDecksData = (decksData) => {
    if (cryptCardBase && libraryCardBase) {
      Object.keys(decksData).map((deckid) => {
        const cardsData = useDeck(
          decksData[deckid].cards,
          cryptCardBase,
          libraryCardBase
        );
        decksData[deckid] = { ...decksData[deckid], ...cardsData };
        if (decksData[deckid].usedInInventory) {
          Object.keys(decksData[deckid].usedInInventory).map((cardid) => {
            if (cardid > 200000) {
              if (decksData[deckid].crypt[cardid]) {
                decksData[deckid].crypt[cardid].i =
                  decksData[deckid].usedInInventory[cardid];
              }
            } else {
              if (decksData[deckid].library[cardid]) {
                decksData[deckid].library[cardid].i =
                  decksData[deckid].usedInInventory[cardid];
              }
            }
          });
        }
        decksData[deckid].isAuthor = true;
        decksData[deckid].isBranches = Boolean(
          decksData[deckid].master || decksData[deckid].branches?.length > 0
        );
        delete decksData[deckid].cards;
      });
    }
    return decksData;
  };

  useEffect(() => {
    if (decks && Object.keys(decks).length > 0) {
      const lastDeckArray = Object.values(decks).sort(byTimestamp);
      setLastDeckId(lastDeckArray[0].deckid);
    }
  }, [decks]);

  useEffect(() => {
    // TODO CHECK IF WORKS FOR UNLOGGED USER
    if (decks || username === null) {
      const d = recentDecks.filter((v) => !decks[v.deckid]);
      if (d.length < recentDecks.length) {
        updateRecentDecks(d);
      }
    }
  }, [decks, recentDecks]);

  const parseInventoryData = (inventoryData) => {
    Object.keys(inventoryData.crypt).map((i) => {
      inventoryData.crypt[i].c = cryptCardBase[i];
    });
    Object.keys(inventoryData.library).map((i) => {
      inventoryData.library[i].c = libraryCardBase[i];
    });

    return { crypt: inventoryData.crypt, library: inventoryData.library };
  };

  // Trigger  Hard and Soft count function on changing decks
  useEffect(() => {
    if (decks) {
      setupHardAndSoftInventory();
    }
  }, [decks]);

  const setupHardAndSoftInventory = () => {
    const softCrypt = {};
    const softLibrary = {};
    const hardCrypt = {};
    const hardLibrary = {};
    const crypts = { h: hardCrypt, s: softCrypt };
    const libraries = { h: hardLibrary, s: softLibrary };

    const addToTarget = (target, deckid, id, quantity) => {
      if (quantity) {
        if (!target[id]) target[id] = {};
        target[id][deckid] = quantity;
      }
    };

    Object.keys(decks).forEach((deckid) => {
      if (decks[deckid].inventoryType) {
        for (const [id, card] of Object.entries(decks[deckid].crypt)) {
          const target = crypts[card.i || decks[deckid].inventoryType];
          addToTarget(target, deckid, id, card.q);
        }
        for (const [id, card] of Object.entries(decks[deckid].library)) {
          const target = libraries[card.i || decks[deckid].inventoryType];
          addToTarget(target, deckid, id, card.q);
        }
      }
    });

    setUsedCrypt({
      soft: softCrypt,
      hard: hardCrypt,
    });
    setUsedLibrary({
      soft: softLibrary,
      hard: hardLibrary,
    });
  };

  return (
    <AppContext.Provider
      value={{
        // APP Context
        isMobile,
        isNarrow,
        isWide,
        isXWide,
        isDesktop,
        lang,
        changeLang,
        isPlaytester,
        isPlaytestAdmin,
        playtest,
        togglePlaytest,
        hideMissing,
        setHideMissing,
        inventoryMode,
        toggleInventoryMode,
        setInventoryMode,
        addMode,
        toggleAddMode,
        showImage,
        setShowImage,
        toggleShowImage,
        showFloatingButtons,
        setShowFloatingButtons,
        showMenuButtons,
        setShowMenuButtons,
        isOnline,

        // USER Context
        whoAmI,
        username,
        setUsername,
        publicName,
        setPublicName,
        email,
        setEmail,
        inventoryKey,
        setInventoryKey,
        initializeUserData,
        initializeUnauthenticatedUser,

        // CARDBASE Context
        cryptCardBase,
        setCryptCardBase,
        libraryCardBase,
        setLibraryCardBase,
        localizedCrypt,
        localizedLibrary,
        nativeCrypt,
        nativeLibrary,

        // DECK Context
        preconDecks,
        recentDecks,
        addRecentDeck,
        lastDeckId,

        // LISTING Context
        showCryptSearch,
        setShowCryptSearch,
        showLibrarySearch,
        setShowLibrarySearch,

        // SORTING Context
        cryptSearchSort,
        changeCryptSearchSort,
        librarySearchSort,
        changeLibrarySearchSort,
        twdSearchSort,
        changeTwdSearchSort,
        pdaSearchSort,
        changePdaSearchSort,
        cryptDeckSort,
        changeCryptDeckSort,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
