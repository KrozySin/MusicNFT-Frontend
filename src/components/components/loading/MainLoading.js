import React from 'react'
import '../../../assets/loading.css'
import MainLoadingAnim from '../../../assets/loading/main-loading.json'
import Lottie from 'react-lottie-player'

const MainLoading = (props) => {
  if (props.show === true) {
    return (
      <div id="loader-absolute-wrapper">
        <div id="loader-lotties">
          <Lottie loop animationData={MainLoadingAnim} play style={{ width: 150, height: 150 }} />
        </div>
      </div>
    )
  }

  return <div />
}

export default MainLoading
