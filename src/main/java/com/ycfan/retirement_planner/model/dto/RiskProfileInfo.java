package com.ycfan.retirement_planner.model.dto;

public class RiskProfileInfo {
    private double mean; // annual rate of return
    private double volatility;

    public RiskProfileInfo() {}

    public RiskProfileInfo(double mean, double volatility) {
        this.mean = mean;
        this.volatility = volatility;
    }

    public double getMean() {
        return mean;
    }

    public void setMean(double mean) {
        this.mean = mean;
    }

    public double getVolatility() {
        return volatility;
    }

    public void setVolatility(double volatility) {
        this.volatility = volatility;
    }
}

