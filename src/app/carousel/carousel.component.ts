import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  cryptoNews: any[] = [];
  fetched!: boolean;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCryptoNews().subscribe(data => {
      this.cryptoNews = data.value
      this.fetched = this.cryptoNews.length > 0 ? true : false
      
      console.log(this.cryptoNews)

    })


    const productContainers = document.querySelectorAll('.product-container');
    const nxtBtn = document.querySelectorAll('.nxt-btn');
    const preBtn = document.querySelectorAll('.pre-btn');

    console.log(productContainers)

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


  


}
