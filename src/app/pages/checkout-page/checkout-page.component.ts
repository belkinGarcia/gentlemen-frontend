import { Component, OnInit, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { UiStateService } from '../../services/ui-state.service';
import { AuthService } from '../../services/auth.service'; 
import { OrderService } from '../../services/order.service'; 
import { ShippingService } from '../../services/shipping.service';
@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper; 
  step1_identificationForm: FormGroup;
  step2_shippingForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shippingCost: number = 0; 
  private cartSubscription: Subscription = new Subscription();
  useSameAddressForBilling = true;
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private uiStateService: UiStateService,
    private authService: AuthService,
    private orderService: OrderService,
    public shippingService: ShippingService,
    private router: Router 
  ) {
    this.step1_identificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.step2_shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'FINALIZAR COMPRA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
    this.cartSubscription = this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.calculateSubtotal();
      this.shippingCost = this.shippingService.calculateFinalShippingCost(this.subtotal);
    });
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.step1_identificationForm.patchValue({ email: currentUser.email });
        this.step2_shippingForm.patchValue({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          dni: currentUser.dni,
          phone: currentUser.phone,
          region: currentUser.district
        });
        setTimeout(() => {
          this.stepper.next();
        }, 0);
      }
    }
  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  proceedToPayment(): void {
    if (this.step2_shippingForm.invalid) {
      this.step2_shippingForm.markAllAsTouched();
      return;
    }
    const finalTotal = this.subtotal + this.shippingCost; 
    const newOrder = this.orderService.createOrder(
      this.cartItems,
      finalTotal,
      this.step2_shippingForm.value
    );
    this.cartService.clearCart(); 
    this.stepper.next();
  }
}