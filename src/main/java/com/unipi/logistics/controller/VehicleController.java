package com.unipi.logistics.controller;

import com.unipi.logistics.dto.VehicleRequest;
import com.unipi.logistics.model.Vehicle;
import com.unipi.logistics.model.Blueprints.VehicleBlueprint;
import com.unipi.logistics.service.VehicleService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }

    @PostMapping("/init")
    public ResponseEntity<String> createVehicle(@RequestBody VehicleRequest vehicleRequest){

        String vehicleType = vehicleRequest.getType().toUpperCase();
        String licensePlate = vehicleRequest.getLicensePlate().toUpperCase();

        VehicleBlueprint vehicleBlueprint = vehicleService.createVehicle(vehicleType);
        System.out.printf("Vehicle of type: %s with speed: %d and space: %d", vehicleType, vehicleBlueprint.getSpeed(), vehicleBlueprint.getSpace());

        vehicleService.saveVehicle(new Vehicle(vehicleType, licensePlate));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Vehicle created successfully");    
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles(){
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
}
