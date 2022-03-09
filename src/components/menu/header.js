import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
//import { header } from 'react-bootstrap';
import { Link } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";
import { useStoneContext } from '../../hooks/useStoneContext';
import { toShortAddress } from '../../core/helper';

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link 
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);



const Header = function({ className }) {
    const [showmenu, btn_icon] = useState(false);
    const [showpop, btn_icon_pop] = useState(false);
    const { 
      isConnected, 
      account, 
      connectWallet, 
      disconnectWallet
    } = useStoneContext();
    const closePop = () => {
      btn_icon_pop(false);
    };

    const refpop = useOnclickOutside(() => {
      closePop();
    });

    const onHandleConnect = () => {
      if (isConnected) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    }

    return (
    <header className={`navbar white ${className}`} id="myHeader">
     <div className='container'>
       <div className='row w-100-nav'>
          <div className='logo px-0'>
              <div className='navbar-title navbar-item'>
                <NavLink to="/">
                <img
                    src="/img/logo.png"
                    className="img-fluid d-block"
                    alt="#"
                  />
                  <img
                    src="/img/logo-2.png"
                    className="img-fluid d-3"
                    alt="#"
                  />
                  <img
                    src="/img/logo-3.png"
                    className="img-fluid d-4"
                    alt="#"
                  />
                  <img
                    src="/img/logo-light.png"
                    className="img-fluid d-none"
                    alt="#"
                  />
                </NavLink>
              </div>
          </div>

          <div className='search'>
            <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..." type="text" />
          </div>
                    
              <BreakpointProvider>
                <Breakpoint l down>
                  {showmenu && 
                  <div className='menu'>
                    <div className='navbar-item'>
                      <NavLink to="/">
                      Home
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/mint">
                      New Music
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/market">
                      Market
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                  </div>
                  }
                </Breakpoint>

                <Breakpoint xl>
                  <div className='menu'>
                    <div className='navbar-item'>
                      <NavLink to="/">
                      Home
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/mint">
                      New Music
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/market">
                      Market
                      <span className='lines'></span>
                      </NavLink>
                    </div>
                  </div>
                </Breakpoint>
              </BreakpointProvider>

              <div className='mainside'>
                <div className='connect-wal'>
                  { account ? 
                    (<a onClick={onHandleConnect}>{toShortAddress(account)}</a>) :
                    (<a onClick={onHandleConnect}>Connect Wallet</a>)
                  }
                </div>
              </div>
              <div className='mainside'>
                <div className="logout">
                  <div id="de-click-menu-profile" className="de-menu-profile" onClick={() => btn_icon_pop(!showpop)} ref={refpop}>                           
                      <img src="../../img/author_single/author_thumbnail.jpg" alt=""/>
                      {showpop && 
                        <div className="popshow">
                          <div className="d-name">
                              <h4>Monica Lucas</h4>
                              <span className="name" onClick={()=> window.open("", "_self")}>Set display name</span>
                          </div>
                          <div className="d-balance">
                              <h4>Balance</h4>
                              12.858 ETH
                          </div>
                          <div className="d-wallet">
                              <h4>My Wallet</h4>
                              <span id="wallet" className="d-wallet-address">DdzFFzCqrhshMSxb9oW3mRo4MJrQkusV3fGFSTwaiu4wPBqMryA9DYVJCkW9n7twCffG5f5wX2sSkoDXGiZB1HPa7K7f865Kk4LqnrME</span>
                              <button id="btn_copy" title="Copy Text">Copy</button>
                          </div>
                          <div className="d-line"></div>
                          <ul className="de-submenu-profile">
                            <li>
                              <span>
                                <i className="fa fa-user"></i> My profile
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-pencil"></i> Edit profile
                              </span>
                            </li>
                          </ul>
                        </div>
                      }
                  </div>
                </div>
              </div>
                  
      </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>     
    </header>
    );
}
export default Header;