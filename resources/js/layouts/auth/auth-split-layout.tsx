import { Link } from '@inertiajs/react';
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import LanguageSelector from '@/components/shared/language-selector';
import ThemeSelector from '@/components/shared/theme-selector';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import useImport from '@/hooks/use-import';
import useSetting from '@/hooks/use-setting';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { isRtl } = useImport();
    const { settings } = useSetting();

    const siteName = isRtl
        ? (settings?.app_name_ar || settings?.app_name_en || 'AquaRO')
        : (settings?.app_name_en || settings?.app_name_ar || 'AquaRO');

    const appLogo = settings?.app_logo || settings?.app_logo_dark;

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-12 bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
            {/* Left Hero Showcase Panel (Desktop) */}
            <div className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 xl:p-14 overflow-hidden bg-slate-950 text-white border-r border-slate-800">
                {/* Background Ambient Glows & Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_10%_-10%,var(--color-primary,rgba(59,130,246,0.25)),transparent)] opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_90%_90%,var(--color-primary,rgba(59,130,246,0.15)),transparent)] opacity-20" />
                <div 
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Top Brand & Status Header */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link href={home()} className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-primary p-0.5 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            {appLogo ? (
                                <img src={appLogo} alt={siteName} className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-lg text-primary">
                                    {siteName?.charAt(0) || 'A'}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                                {siteName}
                            </span>
                        </div>
                    </Link>

                    {/* Operational Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                            {isRtl ? 'النظام يعمل بكفاءة' : 'System Operational'}
                        </span>
                    </div>
                </div>

                {/* Center Content Showcase */}
                <div className="relative z-10 my-auto py-10 max-w-xl space-y-8">
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{siteName}</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-3"
                    >
                        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            {siteName}
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed">
                            {settings?.meta_description || (isRtl ? 'منظومة إدارية ومتكاملة لإدارة المحطات ومتابعة قراءات التشغيل والجودة' : 'Complete enterprise management platform for monitoring and optimizing system operations.')}
                        </p>
                    </motion.div>

                    {/* Glass Cards Showcase */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid gap-3 pt-2"
                    >
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
                            <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    {isRtl ? 'متابعة مباشرة للقراءات' : 'Real-Time Operational Logging'}
                                </h4>
                                <p className="text-xs text-slate-400">
                                    {isRtl ? 'تسجيل ومتابعة ضغط التشغيل ونسبة الأملاح والمعايير' : 'Track operational pressure, conductivity, and parameters instantly.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
                            <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    {isRtl ? 'إدارة الجودة والأمان' : 'Quality & Compliance Assurance'}
                                </h4>
                                <p className="text-xs text-slate-400">
                                    {isRtl ? 'التنبيه التلقائي عند تجاوز الحدود المسموح بها' : 'Automated threshold check and compliance logging.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
                            <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    {isRtl ? 'تقارير دورية وإحصائيات' : 'Analytics & Performance Reports'}
                                </h4>
                                <p className="text-xs text-slate-400">
                                    {isRtl ? 'تحليلات وتقارير يومية وشهرية شاملة' : 'Comprehensive analytics and periodic summary reports.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Footer Stats */}
                <div className="relative z-10 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-6">
                        <div>
                            <span className="block text-white font-bold text-sm">99.9%</span>
                            <span className="text-[11px] text-slate-500">{isRtl ? 'كفاءة التشغيل' : 'Uptime'}</span>
                        </div>
                        <div className="w-px h-7 bg-slate-800" />
                        <div>
                            <span className="block text-white font-bold text-sm">24/7</span>
                            <span className="text-[11px] text-slate-500">{isRtl ? 'متابعة مستمرة' : 'Active Monitoring'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 bg-muted/30 text-foreground transition-colors duration-300">
                {/* Header Toolbar (Mobile Logo & Right Utility Controls) */}
                <div className="flex items-center justify-between w-full">
                    <Link href={home()} className="flex lg:hidden items-center gap-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-md overflow-hidden">
                            {appLogo ? (
                                <img src={appLogo} alt={siteName} className="w-full h-full object-contain" />
                            ) : (
                                <span className="font-bold text-base">{siteName?.charAt(0) || 'A'}</span>
                            )}
                        </div>
                        <span className="font-bold text-lg text-foreground">{siteName}</span>
                    </Link>

                    <div className="flex items-center gap-3 ms-auto">
                        <div className="p-1.5 rounded-xl bg-card border border-border flex items-center gap-2 shadow-xs">
                            <LanguageSelector />
                            <div className="w-px h-4 bg-border" />
                            <ThemeSelector />
                        </div>
                    </div>
                </div>

                {/* Form Card Container */}
                <div className="w-full max-w-md mx-auto my-auto py-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-card border border-border rounded-2xl shadow-xl p-7 sm:p-9 space-y-6"
                    >
                        {/* Title & Description Header */}
                        {(title || description) && (
                            <div className="space-y-2 text-center">
                                {title && (
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Form Content */}
                        {children}
                    </motion.div>
                </div>

                {/* Bottom Footer Note */}
                <div className="text-center text-xs text-muted-foreground pt-4">
                    {settings?.copyright || settings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
                </div>
            </div>
        </div>
    );
}
