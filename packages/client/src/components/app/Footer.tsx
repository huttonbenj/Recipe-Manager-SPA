import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChefHat, Sparkles, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative overflow-hidden">
            {/* Glass background with gradient */}
            <div className="glass-footer bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 dark:from-brand-400/10 dark:to-accent-400/10" />
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-accent-500/10 to-brand-500/10 blur-3xl animate-pulse" />

                <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    {/* Top section with logo and description */}
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-sm animate-pulse" />
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-lg">
                                    <ChefHat className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-surface-900 dark:text-surface-50 font-display">
                                Culinary<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">Canvas</span>
                            </h3>
                        </div>
                        <p className="max-w-2xl mx-auto text-surface-600 dark:text-surface-400 text-lg">
                            Your personal recipe collection, beautifully organized and always accessible.
                            Where culinary creativity meets modern technology.
                        </p>
                    </div>

                    {/* Main footer content */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Navigation */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-brand-500" />
                                Explore
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { to: '/dashboard', label: 'Dashboard' },
                                    { to: '/recipes', label: 'Recipes' },
                                    { to: '/recipes/new', label: 'Create Recipe' },
                                    { to: '/favorites', label: 'Favorites' }
                                ].map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className={cn(
                                                "text-surface-600 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400",
                                                "transition-all duration-200 hover:translate-x-1 hover:scale-105",
                                                "relative group"
                                            )}
                                        >
                                            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 group-hover:w-1.5 transition-all duration-200" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Account */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Account</h4>
                            <ul className="space-y-3">
                                {[
                                    { to: '/profile', label: 'Profile' },
                                    { to: '/settings', label: 'Settings' },
                                    { to: '/help', label: 'Help & Support' },
                                    { to: '/privacy', label: 'Privacy Policy' }
                                ].map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className={cn(
                                                "text-surface-600 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400",
                                                "transition-all duration-200 hover:translate-x-1 hover:scale-105",
                                                "relative group"
                                            )}
                                        >
                                            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 group-hover:w-1.5 transition-all duration-200" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Contact</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                                    <Mail className="h-4 w-4 text-brand-500" />
                                    <span>hello@culinarycanvas.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                                    <Phone className="h-4 w-4 text-brand-500" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                                    <MapPin className="h-4 w-4 text-brand-500" />
                                    <span>San Francisco, CA</span>
                                </li>
                            </ul>
                        </div>

                        {/* Social & Newsletter */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Stay Connected</h4>

                            {/* Social links */}
                            <div className="flex gap-3">
                                {[
                                    { name: 'Instagram', href: '#', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
                                    { name: 'Twitter', href: '#', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                                    { name: 'GitHub', href: '#', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' }
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className={cn(
                                            "group relative p-2 rounded-full transition-all duration-200",
                                            "bg-surface-100 dark:bg-surface-800 hover:bg-gradient-to-br hover:from-brand-500 hover:to-accent-500",
                                            "text-surface-500 hover:text-white dark:text-surface-400",
                                            "hover:scale-110 hover:shadow-lg transform"
                                        )}
                                    >
                                        <span className="sr-only">{social.name}</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                                        </svg>
                                    </a>
                                ))}
                            </div>

                            {/* Newsletter signup */}
                            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 border border-brand-200 dark:border-brand-800">
                                <p className="text-sm text-surface-700 dark:text-surface-300 mb-2">
                                    Get recipe updates & cooking tips
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    />
                                    <button className="px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm rounded-lg hover:from-brand-600 hover:to-accent-600 transition-all duration-200 hover:scale-105">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="mt-12 pt-8 border-t border-surface-200/60 dark:border-surface-800/60">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400">
                                <span>&copy; {currentYear} Culinary Canvas. Made with</span>
                                <Heart className="h-4 w-4 text-accent-500 animate-pulse" />
                                <span>by creative chefs.</span>
                            </div>

                            <button
                                onClick={scrollToTop}
                                className={cn(
                                    "group flex items-center gap-2 px-4 py-2 rounded-full",
                                    "bg-gradient-to-r from-brand-500 to-accent-500 text-white",
                                    "hover:from-brand-600 hover:to-accent-600 transition-all duration-200",
                                    "hover:scale-105 hover:shadow-lg transform"
                                )}
                            >
                                <span className="text-sm font-medium">Back to top</span>
                                <ArrowUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}; 