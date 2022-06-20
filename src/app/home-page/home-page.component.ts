import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { combineLatest, forkJoin, map, switchMap, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { Chart, registerables } from 'chart.js';

const ELEMENT_DATA = [
  {rank: 1, name: 'Hydrogen', price: 1.0079, symbol: 'H', change: '1'},
  {rank: 2, name: 'Helium', price: 4.0026, symbol: 'He', change: '2'},
  {rank: 3, name: 'Lithium', price: 6.941, symbol: 'Li', change: '3'},
];

/**
 * @title Table with sorting
 */


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'name', 'symbol', 'price', 'change', '7d'];
  displayedColumnsLive: string[] = ['Rank', 'Coin', 'Price', 'Market Cap', 'Volume 24hr', 'Circulating Supply', 'highLow24hr']

  dataSource = new MatTableDataSource();
  
  chart: any = []
  cryptoNews: any[] = [];
  topGainers: any[] = [];
  topLosers: any[] = [];
  nameFilter = new FormControl('');

  success!: boolean;
  stats!:any;
  fetched!: boolean;
    
  filterValues = {
    Coin: '',
  };

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService) {
    
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

      this.apiService.getCoins().pipe(
        map(data => {
          return data
        })
      ).subscribe(value => {
        this.stats = value.data.stats;
        this.success = value.status === 'success' ? true : false
      }
    )

    this.apiService.get50Cryptos().pipe(
      map(data => {
        return data
      })
    ).subscribe(data => {
      console.log(data['Top 50 Cryptocurrency Details'])
          this.dataSource = new MatTableDataSource(data['Top 50 Cryptocurrency Details'])
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.createFilter();
          
    })
  
      this.nameFilter.valueChanges
      .subscribe(
        name => {
          this.filterValues.Coin = name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )


      this.apiService.getCryptoNews().subscribe(data => {
        this.cryptoNews = data.value
        this.fetched = this.cryptoNews.length > 0 ? true : false
  
      })


      this.apiService.getTopGainersAndLosers().pipe(
        map(data => {
          return data
        })
      ).subscribe((data: any) => {
        console.log(data)
        this.topGainers = data['Top Gainers']
        this.topLosers = data['Top Losers']
      })
  
  
      const productContainers = document.querySelectorAll('.product-container');
      const nxtBtn = document.querySelectorAll('.nxt-btn');
      const preBtn = document.querySelectorAll('.pre-btn');
  
      productContainers.forEach((item, i) => {
      let containerDimensions = item.getBoundingClientRect();
      let containerWidth = containerDimensions.width;
  
      nxtBtn[i].addEventListener('click', () => {
          item.scrollLeft += containerWidth;
      })
  
      preBtn[i].addEventListener('click', () => {
          item.scrollLeft -= containerWidth;
      })
  })
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {   
    console.log(sortState) 
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  createFilter(): (data: any, filter: string) => boolean {
    
    let filterFunction = function(data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
      return data.Coin.toLowerCase().indexOf(searchTerms.Coin) !== -1
    }
    return filterFunction;
  }


  showChart(){
    this.chart = new Chart('canvas', {
      type: 'line', 
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          }
        },
        plugins: {
          legend: {
            display: false 
          },
          tooltip: {
            enabled: false // <-- this option disables tooltips
          }
        }
      }
    })
  }
}
