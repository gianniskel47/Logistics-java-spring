package com.unipi.logistics.controller;

import com.unipi.logistics.dto.AnalyticsResponse;
import com.unipi.logistics.dto.OrderRequest;
import com.unipi.logistics.model.Order;
import com.unipi.logistics.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<Long> createOrder(@RequestBody OrderRequest orderRequest){

        Order order = new Order(orderRequest.getCustomerName(), orderRequest.getWeight(), orderRequest.getDestination(), orderRequest.getShippingType(), "PENDING",0.0);
        Long savedOrderId = orderService.saveOrderAndGetId(order);
        orderService.processOrderAsync(savedOrderId);

        System.out.printf("Order id: %d", savedOrderId);

        return ResponseEntity.accepted().body(savedOrderId);
    }

    @GetMapping("/analytics")
    public AnalyticsResponse getTotalRevenue(){
        return orderService.getAnalytics();
    }

    @GetMapping("/orders/calculate-fee")
    public ResponseEntity<Double> calculateFee(@RequestParam String type, @RequestParam Double weight){
        double shippingFee = orderService.calculateShipping(type, weight);
        return ResponseEntity.ok(shippingFee);
    }
}
