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

    useEffect(() => {
        // Always make sure loadAgeGroups has no dependency
        //eslint-disable-next-line
        loadBranches().catch(() => {});
    }, [loadBranches]);

    useEffect(() => {
        // Always make sure loadAgeGroups has no dependency
        //eslint-disable-next-line
        loadAgeGroups().catch(() => {});
    }, [loadAgeGroups]);

    const refreshBranches = useCallback(() => {
        setLoadingBranches(true);
        return loadBranches();
    }, [loadBranches]);

    const refreshAgeGroups = useCallback(() => {
        setLoadingAgeGroups(true);
        return loadAgeGroups();
    }, [loadAgeGroups]);

    return (
        <BaseDataContext.Provider
            value={{
                branchLocations, loadingBranches, branchError, refreshBranches,
                ageGroups, loadingAgeGroups, ageGroupError, refreshAgeGroups,
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