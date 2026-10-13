import React from 'react';
import { Head } from '@inertiajs/react';


import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TrustedSection from '@/components/landing/TrustedSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DashboardSection from '@/components/landing/DashboardSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import AnalyticsSection from '@/components/landing/AnalyticsSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import useImport from '@/hooks/use-import';
import useComapny from '@/hooks/use-comapny';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import InstallAppButton from '@/components/shared/install-app-button';

export default function LandingPage() {
    const { t } = useImport();
    const { company } = useComapny();
    const { isInstalled } = usePwaInstall();


    return (
        <>
            <Head title={t('landing.meta.title')} />

            <div className="min-h-screen bg-white dark:bg-slate-950 antialiased overflow-hidden">
                <Navbar />

                <main>
                    <HeroSection />
                    <TrustedSection />
                    <FeaturesSection />
                    <DashboardSection />
                    <WorkflowSection />
                    <AnalyticsSection />
                    <BenefitsSection />
                    <TestimonialsSection />
                    <PricingSection />
                    <FAQSection />
                    <CTASection />
                </main>
                {!isInstalled && (
                    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg px-3 py-1.5 sm:px-6">
                        <div className="max-w-3xl mx-auto">
                            <InstallAppButton variant="button" />
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </>
    );
}

