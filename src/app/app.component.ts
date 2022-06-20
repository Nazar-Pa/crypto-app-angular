import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Chart } from 'chart.js';
import { combineLatest, forkJoin, map, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

const ELEMENT_DATA = [
  {rank: 1, name: 'Hydrogen', price: 1.0079, symbol: 'H', change: '1'},
  {rank: 2, name: 'Helium', price: 4.0026, symbol: 'He', change: '2'},
  {rank: 3, name: 'Lithium', price: 6.941, symbol: 'Li', change: '3'},
];

/**
 * @title Table with sorting
 */


 interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}




 @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
   
  displayedColumns: string[] = ['rank', 'name', 'symbol', 'price', 'change', '7d'];
  dataSource = new MatTableDataSource();
  
  chart: any = []
  nameFilter = new FormControl('');

  success!: boolean;
  stats!:any;
    
  filterValues = {
    name: '',
  };


  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSourceNavbar = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService) {
    this.dataSource.data = TREE_DATA;
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {      

  
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


// return data.data.coins.map((coin: any) => {
//   let subset = (({ rank, name, symbol, price, change, color, uuid }) => ({ rank, name, symbol, price, change, color, uuid }))(coin)
  
//   return subset
