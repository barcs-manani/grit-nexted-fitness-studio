"use client"

import { createContext, useCallback, useContext, useState, useEffect } from "react"

const BaseDataContext = createContext(null);

export function BaseDataProvider({ children }) {
    // Branch locations
    const [branchLocations, setBranchLocations] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [branchError, setBranchError] = useState("");

    // Age groups
    const [ageGroups, setAgeGroups] = useState([]);
    const [loadingAgeGroups, setLoadingAgeGroups] = useState(true);
    const [ageGroupError, setAgeGroupError] = useState("");

    // Fitness fields
    const [fitnessFields, setFitnessFields] = useState([]);
    const [loadingFitnessFields, setLoadingFitnessFields] = useState(true);
    const [fitnessFieldError, setFitnessFieldError] = useState("");

    const loadBranches = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/base/branch-locations",
                { cache: "no-store" }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to load branch locations.");
            setBranchLocations(result);
            setBranchError("");
            return result;
        } catch (err) {
            setBranchError(err.message || "Failed to load branch locations");
            throw err;
        } finally {
            setLoadingBranches(false);
        }
    }, []);

    const loadAgeGroups = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/base/age-groups",
                { cache: "no-store" }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to load age groups.");
            setAgeGroups(result);
            setAgeGroupError("");
            return result;
        } catch (err) {
            setAgeGroupError(err.message || "Failed to load age groups");
            throw err;
        } finally {
            setLoadingAgeGroups(false);
        }
    }, []);

    const loadFitnessFields = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/base/fitness-fields",
                { cache: "no-store" }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to load fitness fields.");
            setFitnessFields(result);
            setFitnessFieldError("");
            return result;
        } catch (err) {
            setFitnessFieldError(err.message || "Failed to load fitness fields");
            throw err;
        } finally {
            setLoadingFitnessFields(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBranches().catch(() => {});
    }, [loadBranches]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadAgeGroups().catch(() => {});
    }, [loadAgeGroups]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFitnessFields().catch(() => {});
    }, [loadFitnessFields]);

    const refreshBranches = useCallback(() => {
        setLoadingBranches(true);
        return loadBranches();
    }, [loadBranches]);

    const refreshAgeGroups = useCallback(() => {
        setLoadingAgeGroups(true);
        return loadAgeGroups();
    }, [loadAgeGroups]);

    const refreshFitnessFields = useCallback(() => {
        setLoadingFitnessFields(true);
        return loadFitnessFields();
    }, [loadFitnessFields]);

    return (
        <BaseDataContext.Provider
            value={{
                branchLocations, loadingBranches, branchError, refreshBranches,
                ageGroups, loadingAgeGroups, ageGroupError, refreshAgeGroups,
                fitnessFields, loadingFitnessFields, fitnessFieldError, refreshFitnessFields
            }}
        >
        {children}
        </BaseDataContext.Provider>
    );
};

export function useBaseData() {
    const context = useContext(BaseDataContext);
    if (!context) throw new Error("useBaseData must be used inside branch locations provider");
    return context;
}