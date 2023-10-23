import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0xF7955416c2343bA69450873D3d20e65D85c17b67"; // Replace with your contract address
const tokenAbi = require("../../../../../Blockchain/build/contracts/EnergyTrade.json");
const contractInstance = new web3.eth.Contract(tokenAbi.abi, contractAddress);

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-data-table',
  styleUrls: ['data-table.component.scss'],
  templateUrl: 'data-table.component.html',
})
export class DataTableComponent implements OnInit {
  prosumerList: any[];

  displayedColumns = ['prosumerAddress','uc', 'energiaConsumida', 'energiaInjetada', 'payProsumer'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getProsumerArray();
  }

  //Pegar array de struct prosumer definida no contrato EnergyTrade
  async getProsumerArray(): Promise<any[]> {
    this.prosumerList = await contractInstance.methods.getProsumerArr().call();

    console.log(this.prosumerList);
    return this.prosumerList;
  }

  //Pagar prosumer que tem créditos de energia a serem recebidos
  payProsumer(address: any): void {
    contractInstance.methods.payProsumerOwner(address).call();
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0,10) + '...' + text.substring(maxLength, 42) : text;
  }
}