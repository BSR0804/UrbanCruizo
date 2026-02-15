import { createContext, useState, useContext, useEffect } from 'react';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState(localStorage.getItem('userCity') || '');

    useEffect(() => {
        if (city) {
            localStorage.setItem('userCity', city);
        }
    }, [city]);

    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => useContext(CityContext);
