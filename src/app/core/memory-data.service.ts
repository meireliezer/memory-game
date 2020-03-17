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
    '#00BFFF',
    '#00FA9A',
    '#00FF00',
    '#2F4F4F',
    '#4B0082',
    '#800000',
    '#800080',
    '#8B4513',
    '#DAA520',
    '#FF00FF',
    '#FFD700'
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

