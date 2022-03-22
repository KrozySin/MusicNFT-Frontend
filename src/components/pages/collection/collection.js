import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../../components/footer';
import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../../store/selectors';
import { fetchHotCollections } from "../../../store/actions/thunks";
import NftMusicCard from "../../components/NftMusicCard";
import api from "../../../core/api";
import { useStoneContext } from "../../../hooks/useStoneContext";
import { getTokenByOwner } from "../../../api";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const Collection = function({ collectionId = 1 }) {
  const { account } = useStoneContext();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(true);
  const handleBtnClick = () => {
    setOpenMenu(true);
    setOpenMenu1(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(true);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
  };

  const [nfts, setNfts] = useState(undefined);
  const [height, setHeight] = useState(0);

  const onImgLoad = ({target:img}) => {
      let currentHeight = height;
      if(currentHeight < img.offsetHeight) {
          setHeight(img.offsetHeight);
      }
  }

  useEffect(() => {
    if (!account) return;

    getTokenByOwner(account, 0, 100)
    .then((response) => {
      if (response.result === true) {
        setNfts(response.data);
      }
    })
  }, [account]);

  const dispatch = useDispatch();
  const hotCollectionsState = useSelector(selectors.hotCollectionsState);
  const hotCollections = hotCollectionsState.data ? hotCollectionsState.data[0] : {};

  useEffect(() => {
      dispatch(fetchHotCollections(collectionId));
  }, [dispatch, collectionId]);

  return (
    <div>
    <GlobalStyles/>
      { hotCollections.author &&  hotCollections.author.banner &&
        <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${api.baseUrl + hotCollections.author.banner.url})`}}>
          <div className='mainbreadcumb'>
          </div>
        </section>
      }

      <section className='container d_coll no-top no-bottom'>
        <div className='row'>
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                  { hotCollections.author &&  hotCollections.author.avatar &&
                    <div className="d_profile_img">
                      <img src={api.baseUrl + hotCollections.author.avatar.url} alt=""/>
                      <i className="fa fa-check"></i>
                    </div>
                  }
                  <div className="profile_name">
                    <h4>
                        { hotCollections.name }                                                
                        <div className="clearfix"></div>
                        <span id="wallet" className="profile_wallet">{ account }</span>
                        <button id="btn_copy" title="Copy Text">Copy</button>
                    </h4>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section className='container no-top'>
            <div className='row'>
              <div className='col-lg-12'>
                  <div className="items_filter">
                    <ul className="de_nav">
                        <li id='Mainbtn' className=""><span onClick={handleBtnClick}>On Sale</span></li>
                        <li id='Mainbtn1' className="active"><span onClick={handleBtnClick1}>Owned</span></li>
                    </ul>
                </div>
              </div>
            </div>

            <div id='zero1' className='onStep fadeIn'>
              <div className='row'>
                {nfts && nfts.map( (nft, index) => {
                  if (openMenu && nft.is_visible === 0) 
                    return '';
                  return (
                    <NftMusicCard nft={nft} audioUrl={nft.audio} key={index} onImgLoad={onImgLoad} height={height} />
                  )}
                )}
              </div>
            </div>
          </section>
      <Footer />
    </div>
  );
}
export default memo(Collection);