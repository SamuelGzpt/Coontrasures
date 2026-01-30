import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.css';
import { ChevronRight, Target, Eye, ShieldCheck, Bus, Briefcase, Package } from 'lucide-react';
import PhotoSlider from '../components/PhotoSlider';
import ServiceSlider from '../components/ServiceSlider';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hero Animation
        const ctx = gsap.context(() => {
            gsap.from('.hero-content > *', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Sections Scroll Animation
            [aboutRef, servicesRef, contactRef].forEach((ref) => {
                gsap.from(ref.current, {
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 80%',
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section id="inicio" ref={heroRef} className="hero">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>Viaja Seguro con <span className="highlight">Cootransures</span></h1>
                    <p>Tu mejor opción en transporte intermunicipal y servicios especiales.</p>
                    <div className="hero-buttons">
                        <a href="#contactanos" className="btn-primary">Contáctanos</a>
                        <a href="#servicios" className="btn-secondary">Nuestros Servicios</a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="quienes-somos" ref={aboutRef} className="section about-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Nuestra Esencia</h2>
                        <p className="subtitle">Comprometidos con el servicio y la comunidad</p>
                    </div>

                    <div className="about-cards-container">
                        <div className="about-card">
                            <div className="icon-wrapper green">
                                <Target size={32} />
                            </div>
                            <h3>Misión</h3>
                            <p>
                                Somos una Cooperativa de transporte escolar, empresarial y turístico.
                                Contamos con un equipo calificado para brindar bienestar y calidad
                                a nuestros asociados y la comunidad.
                            </p>
                        </div>

                        <div className="about-card">
                            <div className="icon-wrapper yellow">
                                <Eye size={32} />
                            </div>
                            <h3>Visión</h3>
                            <p>
                                Ser reconocidos como la Cooperativa líder en transporte.
                                Fortalecemos nuestras estrategias para mejorar la calidad de vida
                                de nuestros asociados y prestar el mejor servicio.
                            </p>
                        </div>

                        <div className="about-card">
                            <div className="icon-wrapper green">
                                <ShieldCheck size={32} />
                            </div>
                            <h3>Política de Calidad</h3>
                            <p>
                                Comprometidos con la seguridad y el cumplimiento.
                                Nuestro personal amable y procesos de mejora continua garantizan
                                la excelencia en cada viaje.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Slider Section */}
            <PhotoSlider />

            {/* Services Section */}
            <section id="servicios" ref={servicesRef} className="section services-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Nuestros Servicios</h2>
                        <p className="subtitle">Soluciones de transporte a tu medida</p>
                    </div>

                    <ServiceSlider />
                </div>
            </section>


            {/* Contact Section */}
            <section id="contactanos" ref={contactRef} className="section contact-section">
                <div className="container">
                    <h2>Contáctanos</h2>
                    <div className="contact-info">
                        <div className="info-item">
                            <h4>Teléfonos</h4>
                            <p>+57 320 123 4567</p>
                            <p>+57 601 234 5678</p>
                        </div>
                        <div className="info-item">
                            <h4>Dirección</h4>
                            <p>Calle Principal # 12-34</p>
                            <p>Terminal de Transportes</p>
                        </div>
                        <div className="info-item">
                            <h4>Horarios</h4>
                            <p>Lunes a Domingo</p>
                            <p>5:00 AM - 9:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
