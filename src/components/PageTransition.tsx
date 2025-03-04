
import React, { PropsWithChildren } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

const PageTransition: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        classNames="page-transition"
        timeout={400}
        unmountOnExit
      >
        <div className="page-transition">{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageTransition;
