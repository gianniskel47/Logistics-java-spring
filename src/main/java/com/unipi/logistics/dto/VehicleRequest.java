package com.unipi.logistics.dto;

public class VehicleRequest {

    private String type;
    private  String licensePlate;

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

    public String getLicensePlate(){
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate){
        this.licensePlate = licensePlate;
    }
}
