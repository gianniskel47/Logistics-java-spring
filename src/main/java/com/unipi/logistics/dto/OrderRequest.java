package com.unipi.logistics.dto;

public class OrderRequest {

    private String shippingType;
    private double weight;
    private String destination;
    private String customerName;

    public String getCustomerName(){
        return customerName;
    }

    public void setCustomerName(String customerName){
        this.customerName = customerName;
    }

    public String getDestination(){
        return destination;
    }

    public void setDestination(String destination){
        this.destination = destination;
    }

    public String getShippingType() {
        return shippingType;
    }

    public void setShippingType(String shippingType) {
        this.shippingType = shippingType;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}
