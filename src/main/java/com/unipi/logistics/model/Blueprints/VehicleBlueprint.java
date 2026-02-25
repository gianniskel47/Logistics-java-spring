package com.unipi.logistics.model.Blueprints;

public class VehicleBlueprint {

    private int space;
    private int speed;

    public VehicleBlueprint(int speed, int space){
        this.space = space;
        this.speed = speed;
    }

    public int getSpace(){
        return space;
    }

    public void setSpace(int space){
        this.space = space;
    }

    public int getSpeed(){
        return speed;
    }

    public void setSpeed(int speed){
        this.speed = speed;
    }
}
