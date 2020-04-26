import { Injectable } from '@angular/core';


export interface ICardData {
  color: string;
  symbol:string;
}

export interface IPair {
  id: number;
  data: ICardData;
}


@Injectable({
  providedIn: 'root'
})
export class MemoryDataService {

  
  private _dataList: Array<ICardData> = [  
    {color:  '#222222', symbol: '&#9728;'},

    {color:  '#FF0000', symbol: '&#9730;'},
    {color:  '#ff9933', symbol: '&#9734;'},
    {color:  '#FFFF00', symbol: '&#9742;'},


    {color:  '#33ff33', symbol: '&#9762;'},
    {color:  '#009800', symbol: '&#9774;'},
    {color:  '#33ffff', symbol: '&#9775;'},


    {color:  '#1292ff', symbol: '&#9786;'},
    {color:  '#0000FF', symbol: '&#9788;'},
    {color:  '#9933ff', symbol: '&#9819;'},

    {color:  '#ff00ff', symbol: '&#9832;'},
    {color:  '#ff3366', symbol: '&#9851;'},
    {color:  '#fceabf', symbol: '&#9863;'},  
  ];






  constructor() {
  }


  public getRandomPairs(num: number): Array<IPair>{
    let randomData = this.randomize(this._dataList);
    randomData.length = num;
    
    let pairs = [];
    randomData.map((data, index) => {
      pairs.push({id:index, data: data});
      pairs.push({id:index, data: data});
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

