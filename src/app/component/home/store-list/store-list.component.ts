import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../../service/home.service";
import {Store} from "../../../model/store";
import {StoreCategories} from "../../../model/store-categories";
import {CustomerService} from "../../../service/customer.service";
import {TokenStorageService} from "../../../service/auth/token-storage.service";

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {

  stores!: Store[];
  categories!: StoreCategories[];
  message: string = '';
  isLoggedIn = false;
  showCustomerBoard = false;
  account_id?: number;
  roles: string[] = [];
  flag: boolean[] = [];

  constructor(private homeService: HomeService,
              private customerService: CustomerService,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() : void {
    this.getAllStore();
    this.getAllCategories();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.account_id = this.tokenStorageService.getUser().id;
      this.showCustomerBoard = this.roles.includes('ROLE_CUSTOMER');
    }
  }

  getAllStore() {
    this.homeService.getAllStore().subscribe(data => {
      this.stores = data;
      this.flag = [];
      for (let i = 0; i < this.stores.length; i++) {
          this.customerService.checkLikeStore(data[i].id, this.account_id).subscribe((data) => {
            this.flag[i] = data;
          })
      }
    })
  }

  findAllByCategoriesList_Id(id: any) {
    this.homeService.findAllByCategoriesList_Id(id).subscribe(data => {
      this.stores = data;
    })
  }

  getAllCategories() {
    this.homeService.getAllCategories().subscribe(data => {
      this.categories = data;
    })
  }

  topStoreSale() {
    this.homeService.topStoreSale().subscribe(stores => {
      this.stores = stores;
    });
  }


  searchStore() {
    if (this.message == "") {
      this.getAllStore();
    } else {
      this.homeService.searchStoreByNameContaining(this.message).subscribe(data => {
        this.stores = data;
      })
    }
  }

  saveId(id: any, name: string) {
    localStorage.setItem(name, id);
  }

  likeStore(store_id: any) {
    this.customerService.likeStore(store_id, this.account_id).subscribe(
      () => {
        this.getAllStore();
      })
  }
}
