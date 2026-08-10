import { Form, Head } from '@inertiajs/react';
import React from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import useImport from '@/hooks/use-import';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { t } = useImport();

    return (
        <AuthLayout
            title={t('auth.login_title')}
            description={t('auth.login_description')}
        >
            <Head title={t('auth.login')} />

            {status && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center text-sm font-medium animate-in fade-in">
                    {status}
                </div>
            )}

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    {t('auth.email')}
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 pointer-events-none text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder={t('auth.email-placeholder')}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                        {t('auth.password')}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-primary hover:underline transition-colors"
                                            tabIndex={5}
                                        >
                                            {t('auth.forget-password')}
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 pointer-events-none text-muted-foreground z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder={t('auth.password-placeholder')}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2.5 rtl:space-x-reverse py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-md border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor="remember" className="text-xs text-muted-foreground font-normal cursor-pointer select-none">
                                    {t('auth.remember')}
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        <span>{t('auth.login')}</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Switch to Register */}
                        <div className="text-center text-sm text-muted-foreground pt-2">
                            {t('auth.no-account')}{' '}
                            <TextLink 
                                href={register()} 
                                tabIndex={5} 
                                className="font-semibold text-primary hover:underline transition-colors"
                            >
                                {t('auth.create-account')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
