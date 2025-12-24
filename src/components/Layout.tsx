import React, { type ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Navbar />
            <main>{children}</main>
            <footer style={{ backgroundColor: '#2C3E50', color: 'white', padding: '2rem', textAlign: 'center', marginTop: 'auto' }}>
                <div className="container">
                    <p>© 2024 Cootransures. Todos los derechos reservados.</p>
                    <p>Transporte seguro y eficiente.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
