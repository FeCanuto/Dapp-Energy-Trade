import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { RenewableContractService } from "src/app/services/contract/renewable.contract.service";

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

  constructor(
    private fb: FormBuilder,
    private contract: RenewableContractService
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
    this.transactionForm.valueChanges.subscribe((x) => {});
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
