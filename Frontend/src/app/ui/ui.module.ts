import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


// Components
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ErrorComponent } from './error/error.component';
import { AppMaterialModule } from "../app-material.module";
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { DataTableComponent } from './data-table/data-table.component';

// Routing
import { UiRoute} from "./ui.routes";
import { RouterModule} from "@angular/router";

// Services
import { RenewableContractService } from "../services/contract/renewable.contract.service";


@NgModule({
  declarations: [
    AccountComponent,
    HomeComponent,
    TopNavComponent,
    TransactionComponent,
    ErrorComponent,
    ThemeSwitchComponent,
    DataTableComponent,    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UiRoute),
    AppMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TopNavComponent,
    HomeComponent
  ],
  providers: [
    RenewableContractService
  ],
})
export class UiModule { }
