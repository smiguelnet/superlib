import React, { useLayoutEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  return (
    <div className="p-5">
      <h4>Obrigado por utilizar o sistema.</h4>

      <div className={'pt-2'}>
        <Link to="/login" className="alert-link">
          fazer novo login
        </Link>
      </div>
    </div>
  );
};

export default Logout;
