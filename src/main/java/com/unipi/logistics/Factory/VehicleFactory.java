package com.unipi.logistics.Factory;

import org.springframework.stereotype.Component;

import com.unipi.logistics.model.Blueprints.Drone;
import com.unipi.logistics.model.Blueprints.Truck;
import com.unipi.logistics.model.Blueprints.Van;
import com.unipi.logistics.model.Blueprints.VehicleBlueprint;

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
                throw new IllegalArgumentException("Unknown type: " + vehicleType);
        }
    }
}
