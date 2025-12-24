import React, { useState, useEffect } from 'react';
import { reportService, type Report } from '../services/reportService';
import './ReportsPage.css';

const ReportsPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [reports, setReports] = useState<Report[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    // Check storage session or similar in real app
    useEffect(() => {
        if (isAuthenticated) {
            setReports(reportService.fetchReports());
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') { // Mock password
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const file = e.target.files[0];
            await reportService.uploadReport(file);
            setReports(reportService.fetchReports());
            setIsUploading(false);
            // Reset input manually if needed
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="reports-login-container">
                <div className="login-box">
                    <h2>Zona de Informes</h2>
                    <p>Solo personal autorizado</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Ingresar</button>
                    </form>
                    <p className="hint">Pista: admin123</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-dashboard container section">
            <div className="dashboard-header">
                <h2>Gestión de Informes</h2>
                <button onClick={() => setIsAuthenticated(false)} className="btn-secondary" style={{ color: '#333', borderColor: '#333' }}>Salir</button>
            </div>

            <div className="upload-section">
                <h3>Subir Nuevo Informe</h3>
                <label className="upload-btn">
                    {isUploading ? 'Subiendo...' : 'Seleccionar PDF'}
                    <input type="file" accept=".pdf" onChange={handleUpload} disabled={isUploading} hidden />
                </label>
            </div>

            <div className="reports-list">
                <h3>Informes Disponibles</h3>
                {reports.length === 0 ? (
                    <p>No hay informes subidos.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Archivo</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td>{report.name}</td>
                                        <td>{report.date}</td>
                                        <td>
                                            <a href={report.url} className="btn-download" onClick={(e) => e.preventDefault()}>Descargar</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
