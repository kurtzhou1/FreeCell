import React from 'react';
import getRandomQuest from './pokercard'
import { getEmptyContentBlock, getCardPositionInBlock } from '../../libs/PokerGame'
import Card from '../Card';

const GameTable = () => {

    const producePokerCardColumn:any = (column:any, columnIndex:number, type:string) => {
        // console.log('column=>',column)
        if(column.length === 0) return getEmptyContentBlock(column,columnIndex,type);
        // const pokerGame = PokerGame(column, columnIndex, type);
        // console.log('pokerGame=>>',pokerGame)
        const getCardId = (cardInformation:any) => {
          const { arrayIndex, } = cardInformation;
          switch (cardInformation.type) {
            case 'question':
            case 'temp':
              return `${arrayIndex.column}_${arrayIndex.row}`;
            case 'over':
              return `${arrayIndex.column + 4}_${arrayIndex.row}`;
            default:
              throw new Error(`Can not get CardId type: ${type}`);
          }
        };
    
        // let currentRowIndex = -1;
        // const produceSingleCard = () => {
        //     const isCanDrap = () => {
        //         switch (type) {
        //             case 'over':
        //             case 'temp':
        //             return true;
        //             case 'question': {
        //             if (currentRowIndex === column.length - 1) {
        //                 return true;
        //             }
        //             // 取得目前 temp empty count
        //             const tempLayoutEmptyCount = tempLayout.reduce((count, value) => value.length === 0 ? count += 1 : count += 0, 0);
        //             // 可移動數
        //             const canDrapCardCount = tempLayoutEmptyCount + 1;
        //             for (let i = currentRowIndex; i < column.length - 1; i += 1) {
        //                 const currentPokerCard = new PokerCard(column[i]);
        //                 const nextPokerCard = new PokerCard(column[i + 1]);
        //                 if (!(currentPokerCard.getPokerMainColor() !== nextPokerCard.getPokerMainColor()
        //                 && currentPokerCard.getPokerNumber() - 1 === nextPokerCard.getPokerNumber()
        //                 && column.length - (currentRowIndex + 1) < canDrapCardCount)) {
        //                 return false;
        //                 }
        //             }
        //             return true;
        //             }
        //             default:
        //             throw new Error(`Can not check can drap with type: ${type}`);
        //         }
        //     };
    
        //     currentRowIndex += 1;
        //   const cardInformation = {
        //     type,
        //     cardId: column[currentRowIndex],
        //     arrayIndex: { column: columnIndex, row: currentRowIndex, },
        //   };
    
        //   return (
        //     <Card
        //       canDrag={isCanDrap()}
        //       key={currentRowIndex}
        //       id={getCardId(cardInformation)}
        //       cardInformation={cardInformation}
        //       position={getCardPositionInBlock(type)}
        //     >
        //       {currentRowIndex < column.length - 1 ? produceSingleCard() : null}
        //     </Card>
        //   );
        // };
        return (
          <Card >
          </Card >
        )
      };

    return(
        <div>
            {getRandomQuest.map((column:any,columnIndex:number)=>
            <div key={columnIndex} className="columnIndex">
                {producePokerCardColumn(column, columnIndex, 'question')}
            </div>)}
        </div>
    )
}

export default GameTable;