import { Injectable } from '@angular/core';


export interface IPair {
  id: number;
  data: any;
}


@Injectable({
  providedIn: 'root'
})
export class MemoryDataService {

  
  private _colorList = [
    '#000000',

    '#000080',
    '#008000',
    '#800000',

    '#000FFF',
    '#00FF00',
    '#FF0000',

    
    '#ff00ff',
    '#ffff00',    
    '#00ffff',

    '#ff6600',
    '#0091ff',
    '#ff0088'
  ];

  


  constructor() {
  }


  public getRandomPairs(num: number): Array<IPair>{
    let randomColors = this.randomize(this._colorList);
    randomColors.length = num;
    
    let pairs = [];
    randomColors.map((color, index) => {
      pairs.push({id:index, data: color});
      pairs.push({id:index, data: color});
    });
    let randomPairs = this.randomize(pairs);
    
    return randomPairs;
  }


  private randomize(list: Array<any>){
    let newList = [...list];
    let len = newList.length;
    for(let i=0; i< len ; ++i){
      let rnd = Math.floor(Math.random()*len);
      let tmp = newList[i];
      newList[i] = newList[rnd];
      newList[rnd] = tmp;
    }
  
    return newList;
  }
  



}

