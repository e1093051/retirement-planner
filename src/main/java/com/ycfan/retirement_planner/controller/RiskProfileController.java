package com.ycfan.retirement_planner.controller;

import com.ycfan.retirement_planner.model.dto.RiskProfileInfo;
import com.ycfan.retirement_planner.service.RiskProfileProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RiskProfileController {

    private final RiskProfileProvider riskProfileProvider;

    public RiskProfileController(RiskProfileProvider riskProfileProvider) {
        this.riskProfileProvider = riskProfileProvider;
    }

    @GetMapping("/api/risk-profiles")
    public Map<String, RiskProfileInfo> getRiskProfiles() {
        return riskProfileProvider.getAll();
    }
}

