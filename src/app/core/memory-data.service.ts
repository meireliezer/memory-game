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
    {color:  '#111111', symbol: '&#9728;'},

    {color:  '#000080', symbol: '&#9730;'},
    {color:  '#008000', symbol: '&#9734;'},
    {color:  '#800000', symbol: '&#9742;'},


    {color:  '#000FFF', symbol: '&#9762;'},
    {color:  '#00FF00', symbol: '&#9774;'},
    {color:  '#FF0000', symbol: '&#9775;'},


    {color:  '#FF00FF', symbol: '&#9786;'},
    {color:  '#FFFF00', symbol: '&#9788;'},
    {color:  '#00FFFF', symbol: '&#9819;'},

    {color:  '#FF6600', symbol: '&#9832;'},
    {color:  '#009191', symbol: '&#9851;'},
    {color:  '#FF0088', symbol: '&#9863;'},  
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

