import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../service/customer.service";
import {TokenStorageService} from "../../service/auth/token-storage.service";
import {Cart} from "../../model/cart";
import {NgToastService} from "ng-angular-popup";
import {Voucher} from "../../model/voucher";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  id?: number;
  private roles: string[] = [];
  isLoggedIn = false;
  showCustomerBoard = false;
  carts!: Cart[];
  discount?: number;
  sum?: number;

  check?: boolean;

  constructor(private customerService: CustomerService,
              private tokenStorageService: TokenStorageService,
              private toast: NgToastService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showCustomerBoard = this.roles.includes('ROLE_CUSTOMER');
      this.id = user.id;
      this.getAllCart();
      this.getTotal();
      this.checkQuantity();
    }
  }

  getAllCart() {
    this.customerService.showCart(this.id).subscribe(data => {
      this.carts = data;
      console.log(data);
    })
  }

  minusQuantity(product_id: any) {
    this.customerService.minusQuantity(this.id, product_id).subscribe(() => {
      this.getAllCart();
      this.getTotal();
      this.checkQuantity();
    });
  }

  plusQuantity(product_id: any) {
    this.customerService.plusQuantity(this.id, product_id).subscribe(() => {
      this.getAllCart();
      this.getTotal();
      this.checkQuantity();
    });
  }

  deleteProduct(product_id: any) {
    this.customerService.deleteProduct(this.id, product_id).subscribe(() => {
      this.toast.success({detail: "Successful Message", summary: "Delete Product Successful", duration: 5000})
      this.getAllCart();
      this.getTotal();
    })
  }

  addBill() {
    this.customerService.addBill(this.id).subscribe(data => {
      if (data == true) {
        this.toast.success({detail: "Successful Message", summary: "Pay Money Successful", duration: 5000})
      } else {
        this.toast.error({detail: "Error Message", summary: "Store doesn't have enough quantity", duration: 5000});
      }
      this.getAllCart();
      this.getTotal();
      this.sum = 0;
    });
  }


  getTotalPrice(cart: Cart) {
    // @ts-ignore
    return cart.quantity * cart.product?.price;
  }

  getTotal() {
    this.customerService.getTotal(this.id).subscribe(data => {
      this.sum = data;
    })
  }

  checkQuantity() {
    this.customerService.checkQuantity(this.id).subscribe(data => {
      this.check = data;
    })
  }

  // getDiscount(cart: Cart) {
  //   this.customerService.getDiscount(cart.product?.store?.id).subscribe(data => {
  //     this.discount = data.discount;
  //   })
  //   return this.discount;
  // }
}
