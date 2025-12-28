package com.ycfan.retirement_planner.service;

import com.ycfan.retirement_planner.model.domain.PathResult;
import com.ycfan.retirement_planner.model.dto.SimulationRequest;
import com.ycfan.retirement_planner.model.dto.SimulationResult;
import com.ycfan.retirement_planner.model.dto.RiskProfileInfo;
import com.ycfan.retirement_planner.service.RiskProfileProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SimulationService {

    private final RiskProfileProvider riskProfileProvider;

    public SimulationService(RiskProfileProvider riskProfileProvider) {
        this.riskProfileProvider = riskProfileProvider;
    }

    private static final Logger log =
            LoggerFactory.getLogger(SimulationService.class);

    // Runs Monte Carlo simulation and returns summary statistics + sample paths
    public SimulationResult runMonteCarlo(SimulationRequest req) {

        validateRequest(req);

        log.info(
                "Starting Monte Carlo simulation: n={}, riskProfile={}",
                req.getNumSimulations(),
                req.getRiskProfile()
        );

        int n = req.getNumSimulations();
        double target = req.getTargetAmount();

        List<Double> finalWealths = new ArrayList<>(n);
        List<List<Double>> samplePaths = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            PathResult one = simulateOnce(req);
            finalWealths.add(one.getFinalWealth());

            // Keep a few paths for visualization (e.g., first 5)
            if (samplePaths.size() < 5) {
                samplePaths.add(one.getPath());
            }
        }

        // Sort for percentile computation
        Collections.sort(finalWealths);

        double p10 = percentileSorted(finalWealths, 0.10);
        double median = percentileSorted(finalWealths, 0.50);
        double p90 = percentileSorted(finalWealths, 0.90);

        int successCount = 0;
        for (double w : finalWealths) {
            if (w >= target) successCount++;
        }
        double prob = (n == 0) ? 0.0 : (successCount * 1.0 / n);

        return new SimulationResult(
                n,
                target,
                median,
                p10,
                p90,
                prob,
                samplePaths
        );
    }

    // Simulates a single retirement path using annual contributions and annual returns
    public PathResult simulateOnce(SimulationRequest req) {

        int yearsToRetire = req.getRetirementAge() - req.getCurrentAge();
        if (yearsToRetire <= 0) {
            throw new IllegalArgumentException("retirementAge must be greater than currentAge");
        }

        double wealth = req.getCurrentSavings();
        double yearlyContribution = req.getYearlyContribution();

        double meanReturn = riskProfileProvider.getOrDefault(req.getRiskProfile()).getMean(); // annual mean
        double stdDev = riskProfileProvider.getOrDefault(req.getRiskProfile()).getVolatility();     // annual volatility

        List<Double> path = new ArrayList<>();
        path.add(wealth); // initial state (year 0)

        for (int year = 0; year < yearsToRetire; year++) {
            // Add contribution at the beginning of the year
            wealth += yearlyContribution;

            // Sample annual return
            double z = randomNormal();
            double annualReturn = meanReturn + stdDev * z;

            // Apply growth
            wealth *= (1.0 + annualReturn);

            if (wealth < 0) wealth = 0;

            path.add(wealth);
        }

        return new PathResult(path, wealth);
    }



    // Generates a standard normal random variable using Box-Muller transform
    protected double randomNormal() {
        double u1 = Math.random();
        double u2 = Math.random();
        if (u1 < 1e-12) u1 = 1e-12;
        return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    }

    // Computes percentile assuming the list is already sorted ascending
    private double percentileSorted(List<Double> sorted, double p) {
        if (sorted.isEmpty()) return 0.0;
        if (p <= 0) return sorted.get(0);
        if (p >= 1) return sorted.get(sorted.size() - 1);

        double idx = p * (sorted.size() - 1);
        int lo = (int) Math.floor(idx);
        int hi = (int) Math.ceil(idx);

        if (lo == hi) return sorted.get(lo);

        double w = idx - lo;
        return sorted.get(lo) * (1.0 - w) + sorted.get(hi) * w;
    }

    private void validateRequest(SimulationRequest req) {
        if (req.getRetirementAge() <= req.getCurrentAge()) {
            throw new IllegalArgumentException("retirementAge must be greater than currentAge");
        }
        if (req.getNumSimulations() <= 0) {
            throw new IllegalArgumentException("numSimulations must be positive");
        }
        if (req.getYearlyContribution() < 0 || req.getCurrentSavings() < 0) {
            throw new IllegalArgumentException("Savings and contribution must be non-negative");
        }
        if (req.getTargetAmount() < 0) {
            throw new IllegalArgumentException("targetAmount must be non-negative");
        }
    }
}

