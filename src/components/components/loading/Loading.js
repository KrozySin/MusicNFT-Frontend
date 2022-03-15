import React from 'react'
import '../../../assets/loading.css'
import MainLoading from './MainLoading'
import { useStoneContext } from '../../../hooks/useStoneContext'

const Loading = () => {
  const { isLoading } = useStoneContext();
  if (isLoading === true) {
    return (
      <div id="loader-wrapper">
        <div className="loader-section" />
        <MainLoading show={isLoading} />
      </div>
    )
  }
  return <div />
}

export default Loading
