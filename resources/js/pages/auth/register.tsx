import { Form, Head } from '@inertiajs/react';
import React from 'react';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import useImport from '@/hooks/use-import';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const { t } = useImport();

    return (
        <AuthLayout
            title={t('auth.create-account')}
            description={t('auth.register_description')}
        >
            <Head title={t('auth.register')} />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4 sm:gap-5">
                            {/* Name Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                    {t('auth.name')}
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 pointer-events-none text-muted-foreground">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder={t('auth.name-placeholder')}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

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
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder={t('auth.email-placeholder')}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    {t('auth.password')}
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 pointer-events-none text-muted-foreground z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder={t('auth.password-placeholder')}
                                        passwordrules={passwordRules}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Password Confirmation Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                    {t('auth.confirm-password')}
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 pointer-events-none text-muted-foreground z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder={t('auth.confirm-password')}
                                        passwordrules={passwordRules}
                                        className="pl-10 rtl:pl-3 rtl:pr-10 h-11 rounded-xl bg-background border-input focus:border-primary transition-all"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>{t('auth.create-account')}</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Switch to Login */}
                        <div className="text-center text-sm text-muted-foreground pt-2">
                            {t('auth.have-account')}{' '}
                            <TextLink 
                                href={login()} 
                                tabIndex={6}
                                className="font-semibold text-primary hover:underline transition-colors"
                            >
                                {t('auth.login')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
