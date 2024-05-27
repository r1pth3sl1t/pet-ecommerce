package com.asf.ecommerce.service;

import com.asf.ecommerce.dto.Purchase;
import com.asf.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
