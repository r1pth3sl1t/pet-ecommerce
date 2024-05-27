import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { AsfValidators } from '../../validators/asf-validators';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Purchase } from '../../common/purchase';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Customer } from '../../common/customer';
import { Address } from '../../common/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  checkoutFormGroup!: FormGroup;

  expirationYears: number[] = [];
  expirationMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService,
              private checkoutServise: CheckoutService,
              private router: Router) {

  }

  ngOnInit() {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,
                                        Validators.minLength(2),
                                        AsfValidators.notOnlyWhitespace]),

        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),

        email: new FormControl('', [Validators.required, Validators.pattern(
        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                                     Validators.minLength(2),
                                     AsfValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required,
                                   Validators.minLength(2),
                                   AsfValidators.notOnlyWhitespace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required,]),

        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      AsfValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
        Validators.minLength(2),
        AsfValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required,
        Validators.minLength(2),
        AsfValidators.notOnlyWhitespace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required,]),

        zipCode: new FormControl('', [Validators.required,
        Validators.minLength(2),
        AsfValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('', [Validators.required,
                                         Validators.minLength(2),
                                         AsfValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    this.formService.getCreditCardMonths(new Date().getMonth() + 1).subscribe(
      data => this.expirationMonths = data
    );

    this.formService.getCreditCardYears().subscribe(
      data => this.expirationYears = data
    );

    this.formService.getCountries().subscribe(
      data => this.countries = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName')!; }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName')!; }
  get email() { return this.checkoutFormGroup.get('customer.email')!; }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street')!; }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city')!; }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state')!; }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country')!; }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode')!; }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street')!; }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city')!; }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state')!; }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country')!; }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode')!; }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  get creditExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }


  onSubmit(): void {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();

    }

      let purchase: Purchase = new Purchase();

      purchase.order = new Order();
      purchase.order.totalPrice = this.totalPrice;
      purchase.order.totalQuantity = this.totalQuantity;

      purchase.orderItems = this.cartService.cartItems.map(cartItem => new OrderItem(cartItem));

      purchase.customer = this.checkoutFormGroup.controls['customer'].value;

      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
      purchase.shippingAddress.country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)).name;
      purchase.shippingAddress.state = JSON.parse(JSON.stringify(purchase.shippingAddress.state)).name;

      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
      purchase.billingAddress.country = JSON.parse(JSON.stringify(purchase.billingAddress.country)).name;
      purchase.billingAddress.state = JSON.parse(JSON.stringify(purchase.billingAddress.state)).name;

      console.log(JSON.stringify(purchase));


      this.checkoutServise.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received. Your tracking number: ${response.orderTrackingNumber}`);

          this.resetCart();
        },
        error: response => {
          alert(`There is an error: ${response.error.message}`);
        }
      });
    }

  resetCart() {

    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardForm = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = creditCardForm?.value.expirationYear;

    let startMonth: number = 1;

    if (selectedYear == currentYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => this.expirationMonths = data
    )
  }

  handleStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') this.shippingAddressStates = data;
        else this.billingAddressStates = data;
      }
    )

  }
}
