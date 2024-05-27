package com.asf.ecommerce.service;

import com.asf.ecommerce.dao.CustomerRepository;
import com.asf.ecommerce.dto.Purchase;
import com.asf.ecommerce.dto.PurchaseResponse;
import com.asf.ecommerce.entity.Address;
import com.asf.ecommerce.entity.Customer;
import com.asf.ecommerce.entity.Order;
import com.asf.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository repository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository repository){
        this.repository = repository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String trackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(trackingNumber);

        Set<OrderItem> items = purchase.getOrderItems();
        items.forEach(item -> order.add(item));

        Address billingAddress = purchase.getBillingAddress();
        order.setBillingAddress(billingAddress);

        Address shippingAddress = purchase.getShippingAddress();
        order.setShippingAddress(shippingAddress);

        Customer customer = purchase.getCustomer();

        Customer customerFromDB = repository.findByEmail(customer.getEmail());

        if(customerFromDB != null) customer = customerFromDB;
        customer.add(order);

        repository.save(customer);

        return new PurchaseResponse(trackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
