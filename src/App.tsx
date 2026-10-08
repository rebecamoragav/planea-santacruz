/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Usuario, PlanLugar, Reserva, Resena, TipoPlan } from './types';
import { 
  inicializarStorage, 
  getUsuarioActual, 
  logoutUsuario, 
  getResenas, 
  registrarEvento 
} from './services/storage';

import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { PlanBuilder } from './components/PlanBuilder';
import { RegisterModal } from './components/RegisterModal';
import { ReservationModal } from './components/ReservationModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewModal } from './components/ReviewModal';
import { RewardBanner } from './components/RewardBanner';
import { UserBookingsModal } from './components/UserBookingsModal';
import { SupportFloating } from './components/SupportFloating';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogView } from './components/BlogView';
import { Footer } from './components/Footer';

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vista, setVista] = useState<'app' | 'admin' | 'blog'>('app');
  const [resenas, setResenas] = useState<Resena[]>([]);

  // Modales
  const [showRegister, setShowRegister] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  // Estados de selección para reserva
  const [planParaReservar, setPlanParaReservar] = useState<PlanLugar | null>(null);
  const [fechaReserva, setFechaReserva] = useState<string>('');
  const [personasReserva, setPersonasReserva] = useState<number>(2);
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);

  // Estado para reseña específica
  const [planParaResena, setPlanParaResena] = useState<string | undefined>(undefined);

  // Filtro inicial rápido desde el hero
  const [tipoFiltroRapido, setTipoFiltroRapido] = useState<TipoPlan | 'todos'>('todos');

  // Inicialización de la app
  useEffect(() => {
    inicializarStorage();
    const user = getUsuarioActual();
    setUsuario(user);

    // Si no hay usuario registrado, mostrar pantalla de registro inicial
    if (!user) {
      setShowRegister(true);
    }

    setResenas(getResenas());

    // Chequear si la URL tiene hash #admin o #blog
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setVista('admin');
    } else if (window.location.hash === '#blog' || window.location.pathname === '/blog') {
      setVista('blog');
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setVista('admin');
      } else if (window.location.hash === '#blog') {
        setVista('blog');
      } else {
        setVista('app');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    const handleDatosActualizados = () => {
      const u = getUsuarioActual();
      if (u) setUsuario(u);
      setResenas(getResenas());
    };
    window.addEventListener('planea_datos_actualizados', handleDatosActualizados);

    registrarEvento('visita_pagina', 'Carga inicial', 'inicio');

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('planea_datos_actualizados', handleDatosActualizados);
    };
  }, []);

  // Recargar reseñas cuando se agregan nuevas
  const recargarResenas = () => {
    setResenas(getResenas());
  };

  // Botón principal: "Arma tu plan"
  const handleArmaTuPlan = () => {
    registrarEvento('clic_arma_tu_plan', 'Arma tu plan', 'hero');
    const el = document.getElementById('armar-plan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Click en categoría rápida del hero
  const handleSelectCategoryHero = (tipo: TipoPlan) => {
    setTipoFiltroRapido(tipo);
    handleArmaTuPlan();
  };

  // Seleccionar un plan para reservar
  const handleSelectPlan = (plan: PlanLugar, fecha: string, personas: number) => {
    // Si no está registrado, primero pedir registro
    if (!usuario) {
      setPlanParaReservar(plan);
      setFechaReserva(fecha);
      setPersonasReserva(personas);
      setShowRegister(true);
      return;
    }

    setPlanParaReservar(plan);
    setFechaReserva(fecha);
    setPersonasReserva(personas);
    registrarEvento('inicio_reserva', `Iniciar reserva ${plan.nombre}`, 'explorador_planes');
    setShowReservation(true);
  };

  // Éxito en reserva
  const handleReservationSuccess = (reserva: Reserva) => {
    setShowReservation(false);
    setReservaConfirmada(reserva);
    setShowConfirmation(true);
    // Actualizar usuario local para reflejar nuevo punto
    const userAct = getUsuarioActual();
    setUsuario(userAct);
  };

  // Éxito en registro inicial
  const handleRegisterSuccess = (nuevoUsuario: Usuario) => {
    setUsuario(nuevoUsuario);
    setShowRegister(false);
    // Si tenía un plan pendiente por reservar, abrir el modal de reserva
    if (planParaReservar) {
      setShowReservation(true);
    }
  };

  // Logout
  const handleLogout = () => {
    logoutUsuario();
    setUsuario(null);
    setShowRegister(true);
  };

  // Navegación al Blog
  const handleOpenBlog = () => {
    registrarEvento('clic_blog', 'Desde dónde nace Planéa', 'navegacion');
    window.location.hash = 'blog';
    setVista('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromBlog = () => {
    window.location.hash = '';
    setVista('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vista de Blog: Desde dónde nace Planéa
  if (vista === 'blog') {
    return (
      <BlogView
        onBack={handleBackFromBlog}
        onArmaTuPlan={() => {
          handleBackFromBlog();
          setTimeout(() => {
            handleArmaTuPlan();
          }, 150);
        }}
      />
    );
  }

  // Vista de Dashboard Administrativo privado
  if (vista === 'admin') {
    return (
      <AdminDashboard 
        onBack={() => {
          window.location.hash = '';
          setVista('app');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF6] text-[#181611] flex flex-col font-sans">
      
      {/* Header institucional */}
      <Header
        usuario={usuario}
        onOpenRegister={() => setShowRegister(true)}
        onOpenAdmin={() => {
          window.location.hash = 'admin';
          setVista('admin');
        }}
        onOpenBookings={() => setShowBookingsModal(true)}
        onLogout={handleLogout}
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenBlog={handleOpenBlog}
      />

      <main className="flex-1">
        {/* Banner de recompensa y puntos si hay usuario */}
        {usuario && (
          <RewardBanner
            usuario={usuario}
            onOpenBookings={() => setShowBookingsModal(true)}
          />
        )}

        {/* Hero de Portada */}
        <LandingHero
          onArmaTuPlan={handleArmaTuPlan}
          onSelectCategory={handleSelectCategoryHero}
        />

        {/* Flujo para armar un plan con filtros y los 60 lugares de Santa Cruz */}
        <PlanBuilder
          key={tipoFiltroRapido}
          initialTipo={tipoFiltroRapido}
          onSelectPlan={handleSelectPlan}
        />

        {/* Sección de Reseñas Aprobadas */}
        <ReviewsSection
          resenas={resenas}
          onOpenReviewModal={() => {
            setPlanParaResena(undefined);
            setShowReviewModal(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onArmaTuPlan={handleArmaTuPlan}
        onOpenAdmin={() => {
          window.location.hash = 'admin';
          setVista('admin');
        }}
        onOpenRegister={() => setShowRegister(true)}
        onSelectCategory={handleSelectCategoryHero}
      />

      {/* Botón flotante de Soporte 78100777 */}
      <SupportFloating />

      {/* Modal 1: Registro Inicial */}
      <RegisterModal
        isOpen={showRegister}
        onSuccess={handleRegisterSuccess}
        onClose={() => setShowRegister(false)}
        canClose={usuario !== null}
      />

      {/* Modal 2: Formulario de Reserva */}
      {usuario && planParaReservar && (
        <ReservationModal
          isOpen={showReservation}
          plan={planParaReservar}
          usuario={usuario}
          initialFecha={fechaReserva}
          initialPersonas={personasReserva}
          onClose={() => setShowReservation(false)}
          onSuccess={handleReservationSuccess}
        />
      )}

      {/* Modal 3: Confirmación y Envío WhatsApp */}
      <ConfirmationModal
        isOpen={showConfirmation}
        reserva={reservaConfirmada}
        onClose={() => setShowConfirmation(false)}
        onDejarResena={(planNombre) => {
          setPlanParaResena(planNombre);
          setShowReviewModal(true);
        }}
      />

      {/* Modal 4: Dejar Reseña */}
      <ReviewModal
        isOpen={showReviewModal}
        usuario={usuario}
        defaultPlan={planParaResena}
        onClose={() => setShowReviewModal(false)}
        onSuccess={recargarResenas}
      />

      {/* Modal 5: Historial y Club de Puntos */}
      <UserBookingsModal
        isOpen={showBookingsModal}
        usuario={usuario}
        onClose={() => setShowBookingsModal(false)}
        onDejarResena={(planNombre) => {
          setPlanParaResena(planNombre);
          setShowReviewModal(true);
        }}
      />

    </div>
  );
}
