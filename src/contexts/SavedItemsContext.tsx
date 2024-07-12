"use client";

import React, { createContext, useContext, useState } from 'react';

interface Invoice {
    invoice: string;
    paymentStatus: string;
    quantity: string;
    totalAmount: string;
}

interface SavedItemsContextProps {
    savedItems: Invoice[];
    addItem: (item: Invoice) => void;
    removeItem: (invoice: string) => void;
}

const SavedItemsContext = createContext<SavedItemsContextProps | undefined>(undefined);

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedItems, setSavedItems] = useState<Invoice[]>([]);

    const addItem = (item: Invoice) => {
        setSavedItems((prevItems) => [...prevItems, item]);
    };

    const removeItem = (invoice: string) => {
        setSavedItems((prevItems) => prevItems.filter((item) => item.invoice !== invoice));
    };

    return (
        <SavedItemsContext.Provider value={{ savedItems, addItem, removeItem }}>
            {children}
        </SavedItemsContext.Provider>
    );
};

export const useSavedItems = () => {
    const context = useContext(SavedItemsContext);
    if (context === undefined) {
        throw new Error('useSavedItems must be used within a SavedItemsProvider');
    }
    return context;
};