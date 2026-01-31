package com.unipi.logistics.service.vehicles;

import org.springframework.stereotype.Component;

@Component
public class VehicleFactory {

    public VehicleBlueprint createVehicle(String vehicleType){

        switch (vehicleType){
            case "DRONE":
                return new Drone();
            case "TRUCK":
                return  new Truck();
            case "VAN":
                return new Van();
            default:
                throw new IllegalArgumentException("Unknown channel: " + vehicleType);
        }
    }
}
