import React from 'react'
import { SideBar } from './SideBar'
import { Header } from './Header'
import { MainArea } from './MainArea'
import Calculator from './calculator'

export const Dashboard = () => {
  return (
  <div className="style_main__zYIqd">
  <SideBar />
  <div className="style_wrapper__OhGxi">
    <Header />
    <div className="style_overview__iPKe6">
      <MainArea />
      <Calculator />
    </div>
  </div>
</div>
  )
}
  