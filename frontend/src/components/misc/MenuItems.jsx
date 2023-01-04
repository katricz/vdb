import React from 'react';
import { Menu } from '@headlessui/react';

const MenuItems = ({ divided, children }) => {
  return (
    <Menu.Items
      className={`absolute top-10 right-0 z-10 rounded border border-borderSecondary bg-bgButton py-2 dark:border-borderSecondaryDark dark:bg-bgButtonDark ${
        divided
          ? 'divide-y divide-borderPrimary dark:divide-borderPrimaryDark'
          : ''
      }`}
    >
      {children}
    </Menu.Items>
  );
};

export default MenuItems;
