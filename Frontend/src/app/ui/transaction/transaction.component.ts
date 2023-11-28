import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { RenewableContractService } from "src/app/services/contract/renewable.contract.service";
import { Prosumer } from '../../models/prosumer/prosumer';
import { ProsumerService } from '../../services/prosumerService/prosumer.service';

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  address: string;
  prosumerAddress: string;
  unidadeConsumidora: number;
  energiaConsumida: number;
  energiaInjetada: number;
  amount: number;
  direction: any;
  transactionForm: FormGroup;
  prosumer = {} as Prosumer;
  prosumers: Prosumer[];

  constructor(
    private fb: FormBuilder,
    private contract: RenewableContractService,
    private prosumerService: ProsumerService
  ) {
    this.transactionForm = new FormGroup({
      unidadeConsumidora: new FormControl("", [Validators.required]),
      prosumerAddress: new FormControl("", [Validators.required]),
      energiaConsumida: new FormControl("", [Validators.required]),
      energiaInjetada: new FormControl("", [Validators.required]),
    });

    contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
      })
      .catch((error: any) => {
        console.log(error);
        contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  ngOnInit(): void {
    this.getProsumer();
    this.transactionForm.valueChanges.subscribe((x) => { });
  }

  //Http get do API Rest
  getProsumer() {
    this.prosumerService.getProsumers().subscribe((prosumer: Prosumer[]) => {
      this.prosumers = prosumer;
    });

    console.log(this.prosumers)
  }

  //Set Prosumer obtidos pela API
  setProsumerByApi() {
    this.getProsumer();
    this.prosumers.forEach(prosumer => {
      this.contract.settingProsumer(this.direction, 
        prosumer.prosumerAddress, 
        prosumer.uc, 
        prosumer.energiaConsumida,
        prosumer.energiaInjetada)
    });
  }

  setProsumer(e) {
    console.log(e);
    this.prosumerAddress = this.transactionForm.value.prosumerAddress;
    this.unidadeConsumidora = this.transactionForm.value.unidadeConsumidora;
    this.energiaConsumida = this.transactionForm.value.energiaConsumida;
    this.energiaInjetada = this.transactionForm.value.energiaInjetada;

    this.contract
      .settingProsumer(
        this.direction,
        this.prosumerAddress,
        this.unidadeConsumidora,
        this.energiaConsumida,
        this.energiaInjetada
      )
      .then((r) => {
        console.log(r);
        this.contract.success();
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transação falhou");
      });
  }
}
