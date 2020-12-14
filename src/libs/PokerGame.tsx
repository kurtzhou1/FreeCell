import React from "react";
import Suit from './suit';

// export const PokerGame = (column:any, columnIndex:number, type:string) =>{
    // if()
    // const getCardPositionInBlock = () => {
    //     const getQuestBlockPosition = () => ({ left: 0, top: 30, });
    //     const getTempOrOverBlockPosition = () => ({ left: -2, top: -2, });
    //     return type === 'question' ? getQuestBlockPosition() : getTempOrOverBlockPosition();
    // }
    // useEffect(()=>{
    //     getCardPositionInBlock()
    // },[])
// }

export const getEmptyContentBlock = (column:any, columnIndex:number,type:string) =>{
    if (type !== 'over') {
      return null;
    }
    const emptyContent = (color:string) => {
        switch (columnIndex) {
          case 0:
            return Suit.Spades.getSuitSvg(color);
          case 1:
            return Suit.Heart.getSuitSvg(color);
          case 2:
            return Suit.Club.getSuitSvg(color);
          case 3:
            return Suit.Diamond.getSuitSvg(color);
          default:
            throw new Error(`Can not get suit for index: ${columnIndex}`);
        }
    };
    return (
        <svg style={{ width: '60px', height: '60px', }} viewBox="0 0 24 24">
            {emptyContent('#99A779')}
        </svg>
    );
}

export  const getCardPositionInBlock = (type:string) => {
    const getQuestBlockPosition = () => ({ left: 0, top: 30, });
    const getTempOrOverBlockPosition = () => ({ left: -2, top: -2, });
    return type === 'question' ? getQuestBlockPosition() : getTempOrOverBlockPosition();
}