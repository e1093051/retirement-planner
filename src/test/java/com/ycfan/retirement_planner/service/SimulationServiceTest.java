package com.ycfan.retirement_planner.service;


import com.ycfan.retirement_planner.model.dto.SimulationRequest;
import com.ycfan.retirement_planner.model.dto.SimulationResult;
import com.ycfan.retirement_planner.service.RiskProfileProvider;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SimulationServiceTest {

    @Test
    void runMonteCarlo_validInput_returnsResult() {
        SimulationService service = new SimulationService(new RiskProfileProvider());

        SimulationRequest req = new SimulationRequest();
        req.setCurrentAge(25);
        req.setRetirementAge(65);
        req.setCurrentSavings(10000);
        req.setYearlyContribution(12000);
        req.setRiskProfile("balanced");
        req.setNumSimulations(100);
        req.setTargetAmount(1000000);

        SimulationResult result = service.runMonteCarlo(req);

        assertNotNull(result);
        assertEquals(100, result.getNumSimulations());
        assertTrue(result.getMedianWealth() > 0);
        assertTrue(result.getP10Wealth() <= result.getMedianWealth());
        assertTrue(result.getMedianWealth() <= result.getP90Wealth());
        assertTrue(
                result.getProbabilityReachTarget() >= 0.0 &&
                        result.getProbabilityReachTarget() <= 1.0
        );
        assertNotNull(result.getSamplePaths());
        assertEquals(5, result.getSamplePaths().size());
    }

    private SimulationRequest validRequest() {
        SimulationRequest req = new SimulationRequest();
        req.setCurrentAge(25);
        req.setRetirementAge(65);
        req.setCurrentSavings(10000);
        req.setYearlyContribution(12000);
        req.setRiskProfile("balanced");
        req.setNumSimulations(100);
        req.setTargetAmount(1000000);
        return req;
    }

    @Test
    void runMonteCarlo_invalidAge_throwsException() {
        SimulationService service = new SimulationService(new RiskProfileProvider());

        SimulationRequest req = validRequest();
        req.setCurrentAge(65);
        req.setRetirementAge(60);

        assertThrows(IllegalArgumentException.class, () -> {
            service.runMonteCarlo(req);
        });
    }

    @Test
    void runMonteCarlo_invalidNumSimulations_throwsException() {
        SimulationService service = new SimulationService(new RiskProfileProvider());

        SimulationRequest req = validRequest();
        req.setCurrentAge(25);
        req.setRetirementAge(65);
        req.setNumSimulations(0);

        assertThrows(IllegalArgumentException.class, () -> {
            service.runMonteCarlo(req);
        });
    }


}

