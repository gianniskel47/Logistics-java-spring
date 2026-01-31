package com.unipi.logistics.service.shipping;

import org.springframework.stereotype.Component;

@Component("FREE")
public class FreeShipping implements ShippingStrategy{

    @Override
    public double calculateShipping(double weight) {
        return 0;
    }
}
