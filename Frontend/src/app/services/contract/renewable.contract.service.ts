import { Inject, Injectable } from "@angular/core";
import { WEB3 } from "../../core/web3";
//import contract from 'truffle-contract'; //acceso a libreria deprecada
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

declare let require: any;
const tokenAbi = require("../../../../../Blockchain/build/contracts/EnergyTrade.json");

@Injectable({
  providedIn: "root",
})
export class RenewableContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  prosumerData: any[];
  web3Modal;
  web3js;
  provider;
  accounts;
  balance;

  constructor(@Inject(WEB3) private web3: Web3, private snackbar: MatSnackBar) {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
        },
      },
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)",
      },
    });
  }

  settingProsumer(
    originAccount: any[],
    prosumerAddress: string,
    unidadeConsumidora: number,
    energiaConsumida: number,
    energiaInjetada: number
  ) {
    return new Promise((resolve, reject) => {
      var contract = require("@truffle/contract");
      const energyContract = contract(tokenAbi);
      energyContract.setProvider(this.provider);
      energyContract
        .deployed()
        .then((instance) => {
          return instance.setProsumer(
            prosumerAddress,
            unidadeConsumidora,
            energiaConsumida,
            energiaInjetada,
            {
              from: originAccount[0],
            }
          );
        })
        .then((status) => {
          if (status) {
            return resolve({ status: true });
          }
        })
        .catch((error) => {
          console.log(error);

          return reject("Error transfering Ether");
        });
    });
  }

  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.dismiss();
  }

  success() {
    const snackbarRef = this.snackbar.open("Transaction complete successfully");
    snackbarRef.dismiss();
  }

  async connectAccount() {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
  }

  async accountInfo(accounts) {
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue, 'ether');
    return this.balance;
  }
}
