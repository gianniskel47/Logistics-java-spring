package com.unipi.logistics.Strategy;

import org.springframework.stereotype.Component;

@Component("STANDARD")
public class StandardShipping implements ShippingStrategy {


    @Override
    public double calculateShipping(double weight) {

        return weight * 2.5;
    }
}

