import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Department, Doctor, DoctorAvailability, FacilityItem, HospitalInfo, ServiceItem } from '../types';
import { publicApi } from '../services/db';
import { errorMessage } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { DepartmentsSection } from '../sections/DepartmentsSection';
import { DoctorsSection } from '../sections/DoctorsSection';
import { ServicesSection } from '../sections/ServicesSection';
import { FacilitiesSection } from '../sections/FacilitiesSection';
import { TariffsSection } from '../sections/TariffsSection';
import { PatientGuideSection } from '../sections/PatientGuideSection';
import { AvailabilitySection } from '../sections/AvailabilitySection';
import { AppointmentSection } from '../sections/AppointmentSection';
import { FaqSection } from '../sections/FaqSection';
import { ContactSection } from '../sections/ContactSection';
import { Footer } from '../sections/Footer';
import { DoctorDetailModal } from '../components/DoctorDetailModal';
import { FullPageError } from '../components/StatusScreens';
import { Loader2 } from 'lucide-react';

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const HomePage: React.FC = () => {
  const { session, profile } = useAuth();
  const location = useLocation();

  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorAvail, setDoctorAvail] = useState<DoctorAvailability | null>(null);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      publicApi.getHospitalInfo(),
      publicApi.getDepartments(),
      publicApi.getDoctors(),
      publicApi.getServices(),
      publicApi.getFacilities(),
    ])
      .then(([info, depts, docs, srvs, facs]) => {
        setHospitalInfo(info);
        setDepartments(depts);
        setDoctors(docs);
        setServices(srvs);
        setFacilities(facs);
      })
      .catch(err => setLoadError(errorMessage(err)));
  }, []);

  // Support links like /#appointment from other pages once content is rendered.
  useEffect(() => {
    if (hospitalInfo && location.hash) {
      setTimeout(() => scrollToId(location.hash.slice(1)), 50);
    }
  }, [hospitalInfo, location.hash]);

  const handleSelectDoctorForModal = async (doc: Doctor) => {
    setSelectedDoctor(doc);
    setDoctorAvail(null);
    try {
      setDoctorAvail(await publicApi.getDoctorSchedule(doc.id));
    } catch {
      setDoctorAvail(null);
    }
  };

  const handleBookDoctorDirectly = (doctorId: string) => {
    setPreselectedDoctorId(doctorId);
    scrollToId('appointment');
  };

  if (loadError) {
    return (
      <FullPageError
        title="We couldn't load the website"
        message={`${loadError} For emergencies, please call the hospital directly.`}
        action={
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl">
            Try again
          </button>
        }
      />
    );
  }

  if (!hospitalInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <div className="text-lg font-bold">Loading We Care Hospital…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar
        hospitalInfo={hospitalInfo}
        signedIn={Boolean(session && profile?.role === 'PATIENT')}
        onNavigateToAppointment={() => scrollToId('appointment')}
      />

      <main className="flex-1">
        <HeroSection
          hospitalInfo={hospitalInfo}
          onBookClick={() => scrollToId('appointment')}
          onFindDoctorClick={() => scrollToId('doctors')}
        />

        <AboutSection hospitalInfo={hospitalInfo} />

        <DepartmentsSection departments={departments} doctors={doctors} onSelectDepartment={() => scrollToId('doctors')} />

        <DoctorsSection
          doctors={doctors}
          departments={departments}
          onSelectDoctor={handleSelectDoctorForModal}
          onBookDoctor={handleBookDoctorDirectly}
        />

        <ServicesSection services={services} onBookService={() => scrollToId('appointment')} />

        <FacilitiesSection facilities={facilities} />

        <TariffsSection hospitalInfo={hospitalInfo} onBookClick={() => scrollToId('appointment')} />

        <PatientGuideSection hospitalInfo={hospitalInfo} onBookClick={() => scrollToId('appointment')} />

        <AvailabilitySection doctors={doctors} departments={departments} onBookDoctorSlot={handleBookDoctorDirectly} />

        <AppointmentSection departments={departments} doctors={doctors} preselectedDoctorId={preselectedDoctorId} />

        <FaqSection />

        <ContactSection hospitalInfo={hospitalInfo} />
      </main>

      <Footer hospitalInfo={hospitalInfo} />

      <DoctorDetailModal
        doctor={selectedDoctor}
        availability={doctorAvail}
        onClose={() => setSelectedDoctor(null)}
        onBookAppointment={handleBookDoctorDirectly}
      />
    </div>
  );
};
