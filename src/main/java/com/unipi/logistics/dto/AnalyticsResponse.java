package com.unipi.logistics.dto;

import com.unipi.logistics.model.Order;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private double totalCost;
    private Map<String, List<Order>> ordersByDestination;
    private Order mostExpensiveOrder;
    private List<Long> delayedOrderIds;

    public AnalyticsResponse(double totalCost, Map<String, List<Order>> ordersByDestination, Order mostExpensiveOrder, List<Long> delayedOrderIds){
        this.totalCost = totalCost;
        this.ordersByDestination = ordersByDestination;
        this.mostExpensiveOrder = mostExpensiveOrder;
        this.delayedOrderIds = delayedOrderIds;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }

    public Map<String, List<Order>> getOrdersByDestination() {
        return ordersByDestination;
    }

    public void setOrdersByDestination(Map<String, List<Order>> ordersByDestination) {
        this.ordersByDestination = ordersByDestination;
    }

    public Order getMostExpensiveOrder() {
        return mostExpensiveOrder;
    }

    public void setMostExpensiveOrder(Order mostExpensiveOrder) {
        this.mostExpensiveOrder = mostExpensiveOrder;
    }

    public List<Long> getDelayedOrderIds() {
        return delayedOrderIds;
    }

    public void setDelayedOrderIds(List<Long> delayedOrderIds) {
        this.delayedOrderIds = delayedOrderIds;
    }
}
