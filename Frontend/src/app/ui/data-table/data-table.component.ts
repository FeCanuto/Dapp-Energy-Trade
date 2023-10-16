import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x99BD22A29254F3CFDeCC5d373975a6aFb2A734F5"; // Replace with your contract address
const tokenAbi =  require("../../../../../Blockchain/build/contracts/EnergyTrade.json");
const contractInstance = new web3.eth.Contract(tokenAbi.abi, contractAddress);

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-data-table',
  styleUrls: ['data-table.component.scss'],
  templateUrl: 'data-table.component.html',
})
export class DataTableComponent implements OnInit{
  prosumerList: Element[];
  displayedColumns = ['uc', 'energiaConsumida', 'energiaInjetada'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngOnInit(): void {
    const prosumerList: Element[] = this.getProsumerArray();
    //this.dataSource.data = prosumerList;
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

    //Pegar array de struct prosumer definida no contrato EnergyTrade
  getProsumerArray(): Element[] {    
    contractInstance.methods.getProsumerArr().call().then((result) => {
      this.prosumerList = result;
    });
    console.log(this.prosumerList);
    return this.prosumerList;
  }

  //Pagar prosumer que tem créditos de energia a serem recebidos
  payProsumer(): void{
    contractInstance.methods.pagarProsumerOwner().call
  }
}

export interface Element {
  uc: number;
  energiaConsumida: number;
  energiaInjetada: number;
}

const ELEMENT_DATA: Element[] = [
  {uc: 123, energiaConsumida: 100, energiaInjetada: 150}
];