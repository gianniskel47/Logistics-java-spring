package com.unipi.logistics.controller;

import com.unipi.logistics.dto.VehicleRequest;
import com.unipi.logistics.model.Vehicle;
import com.unipi.logistics.service.VehicleService;
import com.unipi.logistics.service.vehicles.VehicleBlueprint;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }

    @PostMapping("/init")
    public void createVehicle(@RequestBody VehicleRequest vehicleRequest){

        String vehicleType = vehicleRequest.getType().toUpperCase();
        String licensePlate = vehicleRequest.getLicensePlate().toUpperCase();

        VehicleBlueprint vehicleBlueprint = vehicleService.createVehicle(vehicleType);
        System.out.printf("Vehicle of type: %s with speed: %d and space: %d", vehicleType, vehicleBlueprint.getSpeed(), vehicleBlueprint.getSpace());

        vehicleService.saveVehicle(new Vehicle(vehicleType, licensePlate));
    }
}
