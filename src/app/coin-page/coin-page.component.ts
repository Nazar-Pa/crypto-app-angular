import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../api.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-coin-page',
  templateUrl: './coin-page.component.html',
  styleUrls: ['./coin-page.component.scss']
})
export class CoinPageComponent implements OnInit {
  coinHistory!: [];
  coinPrice!: any;
  coinTimestamp!: any;
  chart: any = []

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    Chart.register(...registerables);
   }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.apiService.getCryptoHistory(params['id'], '7d').pipe(

        map((data: any) => {
          return data.data.history
        })
      ).subscribe(v => {
        this.coinPrice = v.map((coin: any) => coin.price)
        //this.coinTimestamp = v.map((coin: any) => coin.timestamp)
        
        this.coinTimestamp = v.map((coin: any) => new Date(coin.timestamp).toLocaleDateString())
        this.chart = new Chart('canvas', {
          type: 'line', 
          data: {
            labels: this.coinTimestamp,
            datasets: [
              {
                label: 'Price In USD',
                data: this.coinPrice,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
              },
            ],
          },
          options: {
            scales: {
              x: {
                display: true,
              },
              y: {
                display: true,
              }
            },
            plugins: {
              tooltip: {
                enabled: true // <-- this option disables tooltips
              }
            }
          }
        })
        
      })   
    })
}
}