import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Product } from '../../common/product';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product: Product = new Product(0, '', '', '', 0, '', false, 0, new Date(), new Date());

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
      this.handleProductDetails()
    )
  }

  addToCart(product: Product) {
    console.log('Adding to cart: ' + product.name + ' ' + product.unitPrice);

    const cartItem: CartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

  handleProductDetails() {

    const id: number = +this.route.snapshot.paramMap.get('id')!;
    
    this.productService.getProduct(id).subscribe(
      data => {
        this.product = data;
      }
    );
  }

}
