import React, { useState } from "react";
import Swal from 'sweetalert2'

import Clock from "../../components/Clock";
import Footer from '../../components/footer';
import { createGlobalStyle } from 'styled-components';
import { pinFileToIPFS } from "../../../core/nft/pinata";
import { useNFT } from "../../../hooks/useContract";
import * as Wallet from '../../../core/wallet';
import { useStoneContext } from "../../../hooks/useStoneContext";


const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  .mainside{
    .connect-wal{
      display: none;
    }
    .logout{
      display: flex;
      align-items: center;
    }
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const Createpage = () => {
  const nft = useNFT();
  const { account, setIsLoading } = useStoneContext();
  const [files, setFiles] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [urls, setUrls] = useState([]);

  const [title, setTitle] = useState('');
  const [tokenId, setTokenId] = useState(0);
  const [description, setDescription] = useState('');
      
  const toggle = () => setPlaying(!playing);

  const onChange = (e) => {
    var filesTmp = e.target.files;
    if (!filesTmp.length > 0) return;
    console.log(filesTmp[0]);

    let reader = new FileReader();
    reader.onloadend = () => saveFileToPinata(filesTmp[0], filesTmp[0].name);
    reader.readAsDataURL(filesTmp[0]);

    var filesArr = Array.prototype.slice.call(filesTmp);
    document.getElementById("file_name").style.display = "none";
    setFiles([...files, ...filesArr]);
  }

  const saveFileToPinata = (data, name) => {
    const options = {
      pinataMetadata: {
        name: name
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    pinFileToIPFS(data, options.pinataMetadata, options.pinataOptions)
    .then(res => {
      const tempArr = [...urls];
      tempArr.push(res.pinataUrl);
      setUrls(tempArr);
    });
  }

  const mintToken = () => {
    const metadata = {
      title: title,
      description: description,
      tokenURL: urls
    };
    setIsLoading(true);

    Wallet.sendTransaction(
      nft.methods.mint(tokenId, JSON.stringify(metadata)),
      account)
    .then((res) => {
      setIsLoading(false);
      Swal.fire(
        'Good job!',
        `Your creation has successfully finished!<br>Please check the blockexplorer with hash: ${res.transactionHash}`,
        'success'
      )
    })
    .catch((err) => {
      setIsLoading(false);
      console.log(err);
    });
  }

  return (
    <div>
    <GlobalStyles/>

      <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>Create new NFT asset                                                                                                                                                                                                                                                                                                                                                                                                                                                                       </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>

      <div className="row">
        <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
                <div className="field-set">
                    <h5>Upload main audio file</h5>

                    <div className="d-create-file">
                        {files.length === 0 && 
                        <p id="file_name">WMV, WAV or MP3. Max 200mb.</p>
                        }
                        {files.map(x => 
                        <p key="{index}">{x.name}</p>
                        )}
                        <div className='browse'>
                          <input type="button" id="get_file" className="btn-main" value="Browse"/>
                          <input id='upload_file' type="file" accept="audio/*" multiple onChange={onChange} />
                        </div>
                        
                    </div>
                    
                    <div className="spacer-single"></div>

                    <h5>Token ID</h5>
                    <input 
                      type="text" 
                      name="item_tokenId" 
                      id="item_tokenId" 
                      className="form-control" 
                      placeholder="e.g. '1'" 
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}/>

                    <div className="spacer-single"></div>

                    <h5>Title</h5>
                    <input 
                      type="text" 
                      name="item_title" 
                      id="item_title" 
                      className="form-control" 
                      placeholder="e.g. 'Crypto Funk"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)} />

                    <div className="spacer-10"></div>

                    <h5>Description</h5>
                    <textarea 
                      data-autoresize 
                      name="item_desc" 
                      id="item_desc" 
                      className="form-control" 
                      placeholder="e.g. 'This is very limited item'"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}/>

                    <div className="spacer-10"></div>

                    <input 
                      type="button" 
                      id="submit" 
                      className="btn-main" 
                      value="Create Item"
                      onClick={mintToken}/>
                </div>
            </form>
        </div>

        <div className="col-lg-3 col-sm-6 col-xs-12">
                <h5>Preview item</h5>
                <div className="nft__item m-0">
                    <div className="de_countdown">
                      <Clock deadline="December, 30, 2021" />
                    </div>
                    <div className="author_list_pp">
                        <span>                                    
                            <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap">
                        <span>
                            <img src="./img/gallery/5.jpg" id="get_file_2" className="lazy nft__item_preview" alt=""/>
                        </span>
                        <div className="nft_type_wrap">
                            <div onClick={toggle} className="player-container">
                                <div className={`play-pause ${playing ? 'pause' : 'play'}`}></div>
                            </div>
                            <div className={`circle-ripple ${playing ? 'play' : 'init'}`}></div>
                        </div>
                    </div>
                    <div className="nft__item_info">
                        <span >
                            <h4>-</h4>
                        </span>

                        <div className="nft__item_action">
                            <span>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                        </div>                            
                    </div> 
                </div>
            </div>                                         
    </div>

    </section>

      <Footer />
    </div>
  );
}

export default Createpage;