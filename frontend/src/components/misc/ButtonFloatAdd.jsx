import React from 'react';
import Plus from '@/assets/images/icons/plus.svg';
import { ButtonFloat } from '@/components';
import { useApp } from '@/context';

const ButtonFloatAdd = () => {
  const { showFloatingButtons, toggleAddMode } = useApp();

  return (
    <>
      {showFloatingButtons && (
        <ButtonFloat
          onClick={toggleAddMode}
          position="middle"
          variant="primary"
        >
          <Plus width="47" height="47" viewBox="0 0 16 16" />
        </ButtonFloat>
      )}
    </>
  );
};

export default ButtonFloatAdd;
