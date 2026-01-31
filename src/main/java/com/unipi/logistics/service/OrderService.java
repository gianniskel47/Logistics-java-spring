package com.unipi.logistics.service;

import com.unipi.logistics.dto.AnalyticsResponse;
import com.unipi.logistics.model.Order;
import com.unipi.logistics.repository.OrderRepository;
import com.unipi.logistics.service.shipping.ShippingStrategy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final Map<String, ShippingStrategy>  shippingStrategyMap;

    public OrderService(OrderRepository orderRepository, Map<String, ShippingStrategy> shippingStrategyMap)
    {
        this.orderRepository = orderRepository;
        this.shippingStrategyMap = shippingStrategyMap;
    }

    public Long saveOrderAndGetId(Order order){

        if(order == null){
            System.out.println("Order is null");
            return null;
        }

        Order savedOrder = orderRepository.save(order);
        System.out.println("Order saved");
        return savedOrder.getId();
    }

    @Async
    public void processOrderAsync(Long orderId){
        try{
            System.out.println("Async thread started for order id: " + orderId);

            Thread.sleep(3000);
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

            ShippingStrategy shippingStrategy = shippingStrategyMap.get(order.getShippingType());
            double shippingCost = shippingStrategy.calculateShipping(order.getWeight());
            order.setCost(shippingCost);
            order.setStatus("PROCESSED");
            orderRepository.save(order);
            System.out.println("Shipping cost is: " + shippingCost);

        } catch (Exception e){
            System.out.println(e);
        }
    }

    public AnalyticsResponse getAnalytics(){

        List<Order> allOrders = orderRepository.findAll();
        double totalCost = allOrders.stream().map(Order::getCost).reduce(0.0, Double::sum);
        Order mostExpensiveOrder = allOrders.stream().max(Comparator.comparing(Order::getCost)).orElse(null);
        List<Long> delayedOrderIds = allOrders.stream().filter(order -> order.getStatus().equals("DELAYED")).map(Order::getId).toList();
        Map<String, List<Order>> ordersByDestination = allOrders.stream().collect(groupingBy(Order::getDestination));

        return new AnalyticsResponse(totalCost, ordersByDestination, mostExpensiveOrder, delayedOrderIds);
    }
}
