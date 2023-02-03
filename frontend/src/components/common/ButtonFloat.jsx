import React from 'react';

const ButtonFloat = ({
  onClick,
  position = 'bottom',
  variant = 'primary',
  children,
  className,
}) => {
  const positionClass = {
    top: 'bottom-[175px] sm:bottom-[145px]',
    middle: 'bottom-[115px] sm:bottom-[85px]',
    bottom: 'bottom-[55px] sm:bottom-[25px]',
  };

  const style = {
    primary: 'bg-midGray dark:bg-midGrayDark opacity-80',
    secondary: 'bg-darkGray dark:bg-darkGrayDark opacity-30',
    danger: 'bg-bgRed dark:bg-bgRedDark opacity-80',
    success: 'bg-bgGreen dark:bg-bgGreenDark opacity-80',
  };

  return (
    <div
      onClick={onClick}
      className={`z-60 fixed right-[15px] h-[48px] w-[48px] items-center justify-center rounded-[25px] text-[#fff] sm:right-[25px] ${
        positionClass[position]
      } ${style[variant]} ${className ?? ''}`}
    >
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ButtonFloat;
