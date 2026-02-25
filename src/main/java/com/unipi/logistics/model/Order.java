package com.unipi.logistics.model;

import jakarta.persistence.*;

@Entity
@Table(name="orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private  String customerName;
    private  double weight;
    private  String destination;
    private  String shippingType;
    private  String status;
    private  double cost;

    public Order(){

    }

    public  Order(String customerName, double weight, String destination, String shippingType, String status, double cost){
        this.customerName = customerName;
        this.weight = weight;
        this.destination = destination;
        this.shippingType = shippingType;
        this.status = status;
        this.cost = cost;
    }

    public Long getId(){
        return id;
    }


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getShippingType() {
        return shippingType;
    }

    public void setShippingType(String shippingType) {
        this.shippingType = shippingType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }
}
