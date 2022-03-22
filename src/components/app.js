import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';

import Home from './pages/home/';
import Createpage from './pages/create';
import Collection from './pages/collection';

import { StoneProvider } from './provider';

import { createGlobalStyle } from 'styled-components';
import Loading from './components/loading/Loading';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0,0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const app= () => (
  <StoneProvider>
    <div className="wraper">
      <Loading />
      <GlobalStyles />
      <Header/>
      <PosedRouter>
        <ScrollTop path="/">
          <Home exact path="/">
            <Redirect to="/home" />
          </Home>
          <Createpage path="/mint" />
          <Collection path="/collection" />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
  </StoneProvider>
);
export default app;