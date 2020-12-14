import React from 'react';
import SideMent from './SideMenu/SideMenu';
import GameTable from './GameTable/GameTable'
import './index.scss';

var styles = require('./index.scss')

const Module = () => {
  return (
    <div className="freeCell_Module">
      <GameTable />
      <SideMent />
    </div>
  );
}

export default Module;
