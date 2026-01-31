package com.unipi.logistics.service;

import com.unipi.logistics.model.Vehicle;
import com.unipi.logistics.repository.VehicleRepository;
import com.unipi.logistics.service.vehicles.VehicleBlueprint;
import com.unipi.logistics.service.vehicles.VehicleFactory;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleFactory vehicleFactory;

    public VehicleService(VehicleRepository vehicleRepository, VehicleFactory vehicleFactory){
        this.vehicleRepository = vehicleRepository;
        this.vehicleFactory = vehicleFactory;
    }

    public void saveVehicle(Vehicle vehicle){

        vehicleRepository.save(vehicle);
    }

    public VehicleBlueprint createVehicle(String vehicleType){
        return vehicleFactory.createVehicle(vehicleType);
    }
}
