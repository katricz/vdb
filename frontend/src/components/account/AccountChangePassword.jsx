import React, { useState, useRef } from 'react';
import Spinner from 'assets/images/icons/three-dots.svg';
import Check2 from 'assets/images/icons/check2.svg';
import LockFill from 'assets/images/icons/lock-fill.svg';
import EyeFill from 'assets/images/icons/eye-fill.svg';
import EyeSlashFill from 'assets/images/icons/eye-slash-fill.svg';
import { Input, Button, ErrorOverlay } from 'components';
import { userServices } from 'services';
import { useApp } from 'context';

const AccountChangePassword = () => {
  const { isMobile } = useApp();

  const [state, setState] = useState({
    password: '',
    newPassword: '',
  });

  const [passwordError, setPasswordError] = useState(false);
  const [spinnerState, setSpinnerState] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [buttonState, setButtonState] = useState(false);

  // const refOldPassword = useRef();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onError = (e) => {
    if (e.message == 401) {
      setPasswordError('WRONG OLD PASSWORD');
      // refOldPassword.current.focus();
    } else {
      setPasswordError('CONNECTION PROBLEM');
    }
    setSpinnerState(false);
  };

  const onSuccess = () => {
    setButtonState(true);
    setSpinnerState(false);
    setTimeout(() => {
      setButtonState(false);
    }, 1000);
    setState({
      password: '',
      newPassword: '',
    });
  };

  const changePassword = () => {
    setPasswordError(false);
    setSpinnerState(true);

    userServices.changePassword(
      state.password,
      state.newPassword,
      onSuccess,
      onError
    );
  };

  const handleSubmitButton = (event) => {
    event.preventDefault();
    changePassword();
  };

  const OldPasswordForm = (
    <>
      <Input
        className={`w-full ${isMobile ? '' : 'rounded-none'}`}
        placeholder="Old password"
        type={hidePassword ? 'password' : 'text'}
        name="password"
        required={true}
        value={state.password}
        onChange={handleChange}
        /* ref={refOldPassword} */
      />
    </>
  );

  const NewPasswordForm = (
    <>
      <Input
        className={`w-full ${isMobile ? '' : 'rounded-none'}`}
        placeholder="New password"
        type={hidePassword ? 'password' : 'text'}
        name="newPassword"
        autoComplete="new-password"
        id="new-password"
        required={true}
        value={state.newPassword}
        onChange={handleChange}
      />
      <Button
        className="rounded-none"
        tabIndex="-1"
        variant="primary"
        onClick={() => setHidePassword(!hidePassword)}
      >
        {hidePassword ? <EyeFill /> : <EyeSlashFill />}
      </Button>
      <Button
        className="rounded-l-none"
        variant={buttonState ? 'success' : 'primary'}
        type="submit"
      >
        {!spinnerState ? <Check2 /> : <Spinner />}
      </Button>
    </>
  );

  return (
    <div>
      <div className="text-blue flex items-center text-lg font-bold">
        <LockFill />
        <span>Change password</span>
      </div>
      <form className="flex" onSubmit={handleSubmitButton}>
        {isMobile ? (
          <>
            {OldPasswordForm}
            <div>{NewPasswordForm}</div>
          </>
        ) : (
          <>
            {OldPasswordForm}
            {NewPasswordForm}
          </>
        )}
        {passwordError && (
          <ErrorOverlay placement="bottom">{passwordError}</ErrorOverlay>
        )}
      </form>
    </div>
  );
};

export default AccountChangePassword;
