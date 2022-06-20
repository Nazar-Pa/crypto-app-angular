import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { CoinModel } from './coin.model';


const options = {
  headers: {
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
    'X-RapidAPI-Key': '0bce8e5634msh466fe7ccf0d23e4p130888jsndaf5816204a3'
  },
  params: {
    referenceCurrencyUuid: 'yhjMzLPhuIDl',
    timePeriod: '24h',
    'tiers[0]': '1',
    orderBy: 'marketCap',
    orderDirection: 'desc',
    limit: '50',
    offset: '0'
  }
};

const cryptoNewsOptions = {
  headers: {
    'x-bingapis-sdk': 'true',
    'x-rapidapi-key': '0bce8e5634msh466fe7ccf0d23e4p130888jsndaf5816204a3',
    'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
  }
}

const cryptoUpdateApiHeaders = {
  headers: {
    'X-RapidAPI-Key': '0bce8e5634msh466fe7ccf0d23e4p130888jsndaf5816204a3',
    'X-RapidAPI-Host': 'crypto-update-live.p.rapidapi.com'
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  

  getCoins(): Observable<any>{
    return this.http.get<any>('https://coinranking1.p.rapidapi.com/coins', options)
  }


  getCryptoHistory(uuid: any, timeperiod: any): Observable<any>{
    return this.http.get<any>(`https://coinranking1.p.rapidapi.com/coin/${uuid}/history?timeperiod=${timeperiod}`, options)
  }

  getCryptoNews(): Observable<any>{
    return this.http.get<any>('https://bing-news-search1.p.rapidapi.com/news/search?q=Cryptocurrency&safeSearch=Off&textFormat=Raw&freshness=Day&count=10', cryptoNewsOptions)
  }

  get50Cryptos(): Observable<any>{
    return this.http.get<any>('https://crypto-update-live.p.rapidapi.com/top-currency/top_50_details', cryptoUpdateApiHeaders)
  }

  getTopGainersAndLosers(): Observable<any>{
    return this.http.get<any>('https://crypto-update-live.p.rapidapi.com/top-gainers-losers', cryptoUpdateApiHeaders)
  }
}
