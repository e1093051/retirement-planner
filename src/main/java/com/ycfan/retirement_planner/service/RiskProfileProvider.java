package com.ycfan.retirement_planner.service;

import com.ycfan.retirement_planner.model.dto.RiskProfileInfo;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class RiskProfileProvider {

    // Keep ordering stable for UI display
    private static final Map<String, RiskProfileInfo> PROFILES = new LinkedHashMap<>();

    static {
        PROFILES.put("conservative", new RiskProfileInfo(0.04, 0.08));
        PROFILES.put("balanced", new RiskProfileInfo(0.06, 0.12));
        PROFILES.put("aggressive", new RiskProfileInfo(0.08, 0.18));
    }

    /** Returns all profiles for UI/documentation */
    public Map<String, RiskProfileInfo> getAll() {
        return PROFILES;
    }

    /** Returns mean/volatility for a profile, defaulting to balanced */
    public RiskProfileInfo getOrDefault(String riskProfile) {
        if (riskProfile == null) return PROFILES.get("balanced");
        String key = riskProfile.toLowerCase(Locale.ROOT);
        return PROFILES.getOrDefault(key, PROFILES.get("balanced"));
    }
}

