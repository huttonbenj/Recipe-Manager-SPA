import React from 'react';
import { Helmet } from 'react-helmet-async';

export const FontLoader: React.FC = () => {
    return (
        <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </Helmet>
    );
}; 