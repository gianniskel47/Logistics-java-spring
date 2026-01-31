package com.unipi.logistics.model;

import jakarta.persistence.*;

@Entity
@Table(name="vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String licensePlate;

    public  Vehicle(){

    }

    public  Vehicle(String type, String licensePlate){
        this.type = type;
        this.licensePlate = licensePlate;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

    public String getLicensePlate(){
        return licensePlate;
    }

    public void setLicencePlate(String licensePlate){
        this.licensePlate = licensePlate;
    }
}
