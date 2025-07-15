/**
 * Landing page component
 * Public landing page for unauthenticated users to showcase the app
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Heart,
  Bookmark,
  Star,
  Users,
  ChefHat,
  Clock,
  ArrowRight,
  Sparkles,
  Trophy,
  User,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { Card } from '@/components/ui';
import { RecipeCard } from '@/components/recipe';
import { useTheme, ColorTheme, DisplayMode, ThemeConfig } from '@/context/ThemeContext';
import { Recipe } from '@/types/recipe';

// --- Data (as provided) ---

const activityFeed = [
  'Sarah just shared a Vegan Lasagna',
  'Mike bookmarked Spicy Ramen',
  '3 new recipes added today',
  'Anna commented on Chocolate Cake',
  'Liam favorited Avocado Toast',
];

const avatarColors = ['#0ea5e9', '#f59e42', '#ef4444', '#22c55e', '#a855f7', '#f43f5e'];
const avatarInitials = ['SA', 'MI', 'AN', 'LI', 'PR', 'CA'];

const features = [
  {
    title: 'Discover Amazing Recipes',
    description: 'Browse thousands of recipes from our community of passionate home cooks.',
    icon: Search,
    color: 'from-primary-500 to-primary-600',
  },
  {
    title: 'Quick & Easy Cooking',
    description: 'Find recipes that fit your schedule with our time-based filters.',
    icon: Clock,
    color: 'from-accent-500 to-accent-600',
  },
  {
    title: 'Community Favorites',
    description: 'Discover what other food lovers are cooking and sharing.',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Save & Organize',
    description: 'Keep your favorite recipes organized and easily accessible.',
    icon: Bookmark,
    color: 'from-fuchsia-500 to-purple-600',
  },
];

const stats = [
  { label: 'Recipes Shared', value: '10,000+', icon: ChefHat },
  { label: 'Home Cooks', value: '2,500+', icon: Users },
  { label: 'Five Star Recipes', value: '1,200+', icon: Star },
  { label: 'Countries', value: '50+', icon: Trophy },
];

const THEME_SHOWCASE = [
  { name: 'Ocean Blue', key: 'default', colors: ['#0ea5e9', '#64748b', '#ef4444'] },
  { name: 'Emerald Forest', key: 'emerald', colors: ['#10b981', '#64748b', '#f59e0b'] },
  { name: 'Royal Blue', key: 'blue', colors: ['#3b82f6', '#64748b', '#d946ef'] },
  { name: 'Purple Haze', key: 'purple', colors: ['#a855f7', '#64748b', '#f97316'] },
  { name: 'Rose Garden', key: 'rose', colors: ['#f43f5e', '#64748b', '#22c55e'] },
  { name: 'Sunset Orange', key: 'orange', colors: ['#f97316', '#64748b', '#eab308'] },
];

const DISPLAY_MODES = [
  { mode: 'light', name: 'Light', icon: Sun },
  { mode: 'dark', name: 'Dark', icon: Moon },
  { mode: 'system', name: 'System', icon: Monitor },
];

// --- Refined & Unified Home Page ---

export const Home: React.FC = () => {
  const { theme, setColorTheme, setDisplayMode } = useTheme();
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  // --- Hooks ---
  useIntersectionObserver();
  useFeaturedRecipes(setFeaturedRecipes, setRecipesLoading, setRecipesError);

  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 transition-colors duration-500">
      <HeroSection />
      <div className="relative z-10">
        <AngledDivider topColor="dark:bg-secondary-950 bg-secondary-50" bottomColor="dark:bg-secondary-900 bg-white" />
        <FeaturesSection />
        <AngledDivider topColor="dark:bg-secondary-900 bg-white" bottomColor="dark:bg-gradient-stats bg-gradient-stats" isGradient />
        <StatsSection />
        <AngledDivider topColor="dark:bg-gradient-stats bg-gradient-stats" bottomColor="dark:bg-secondary-900 bg-white" isGradient />
        <FeaturedRecipesSection loading={recipesLoading} error={recipesError} recipes={featuredRecipes} />
        <AngledDivider topColor="dark:bg-secondary-900 bg-white" bottomColor="dark:bg-secondary-950 bg-secondary-50" />
        <ThemeShowcaseSection theme={theme} setColorTheme={setColorTheme} setDisplayMode={setDisplayMode} />
        <AngledDivider topColor="dark:bg-secondary-950 bg-secondary-50" bottomColor="dark:bg-secondary-900 bg-white" />
        <FinalCTASection />
      </div>
    </div>
  );
};

// --- Page Sections ---

const HeroSection = () => {
  const [trustedCount] = useAnimatedCounter(2500, 1200);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-hero-light dark:bg-gradient-hero-dark transition-colors duration-700" aria-label="Landing Hero">
      <FloatingShapes />
      <div className="relative z-20 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-secondary-900 dark:text-white drop-shadow-lg mb-4 animate-slide-up">
          Cook, Share,{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-accent-400 to-primary-500 bg-clip-text text-transparent animate-shimmer">Discover</span>
            <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10 Q 60 2 115 10" stroke="url(#accent-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <defs><linearGradient id="accent-gradient"><stop stopColor="#f59e42" /><stop offset="1" stopColor="#f43f5e" /></linearGradient></defs>
            </svg>
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-secondary-600 dark:text-primary-100 mb-8 animate-fade-in max-w-2xl mx-auto">
          Find inspiration for your next meal, share your favorite recipes, and join a vibrant community of food lovers.
        </p>
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" aria-label="Live users">
          {avatarInitials.map((initials, i) => (
            <span key={i} className="relative inline-block">
              <svg className="w-10 h-10 rounded-full shadow-lg" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="20" fill={avatarColors[i % avatarColors.length]} />
                <text x="50%" y="54%" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff" dy=".3em">{initials}</text>
              </svg>
              <span className="absolute -inset-1 rounded-full border-2 border-primary-400/80 animate-pulse-soft" aria-hidden="true"></span>
            </span>
          ))}
          <span className="ml-3 text-secondary-600 dark:text-primary-100 text-sm font-medium">Live now with {activityFeed.length} updates</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-2 mx-auto max-w-fit">
          <Link to="/register"><Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold" leftIcon={<User className="mr-2 h-5 w-5" />}>Get Started Free</Button></Link>
          <Link to="/recipes"><Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-0" leftIcon={<Search className="mr-2 h-5 w-5" />}>Browse Recipes</Button></Link>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in" aria-label="Trusted by home cooks">
          <Users className="w-5 h-5 text-primary-500 dark:text-primary-200" />
          <span className="text-secondary-600 dark:text-primary-100 font-semibold" aria-live="polite">Trusted by {trustedCount.toLocaleString()}+ home cooks</span>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-secondary-900 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <SectionBadge text="Why Choose Our Platform" icon={Sparkles} />
        <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">Everything You Need to <span className="text-primary-600 dark:text-primary-400">Cook Better</span></h2>
        <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">From discovering new recipes to organizing your favorites, we&apos;ve got everything to make your cooking journey delightful.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card p-8 text-center transition-all duration-300 border-transparent hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-2xl hover:-translate-y-2 bg-secondary-50/50 dark:bg-secondary-800/20">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-secondary-600 dark:text-secondary-300">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 bg-gradient-stats dark:bg-gradient-stats" aria-label="Community Statistics">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-900 dark:text-white">Join Our Growing Community</h2>
        <p className="text-xl max-w-3xl mx-auto text-secondary-600 dark:text-secondary-300">Thousands of home cooks are already sharing their passion for food.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <stat.icon className="w-10 h-10 text-secondary-700 dark:text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2 text-secondary-900 dark:text-white">{stat.value}</div>
            <div className="text-lg text-secondary-600 dark:text-secondary-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedRecipesSection = ({ loading, error, recipes }: { loading: boolean; error: string | null; recipes: Recipe[] }) => (
  <section className="py-20 md:py-28 bg-white dark:bg-secondary-900 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <SectionBadge text="Community Favorites" icon={ChefHat} />
        <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">Recently Shared <span className="text-primary-600 dark:text-primary-400">Recipes</span></h2>
        <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">Discover what our community is cooking and get inspired for your next meal.</p>
      </div>
      {loading && <RecipeGridSkeleton />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        recipes.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <div key={recipe.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in transition-transform duration-300 hover:scale-105">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link to="/register"><Button size="lg" className="px-8 py-4 text-lg" leftIcon={<ArrowRight className="w-5 h-5" />}>Join to See More Recipes</Button></Link>
            </div>
          </>
        ) : <NoRecipesMessage />
      )}
    </div>
  </section>
);

interface ThemeShowcaseProps {
  theme: ThemeConfig;
  setColorTheme: (theme: ColorTheme) => void;
  setDisplayMode: (mode: DisplayMode) => void;
}

const ThemeShowcaseSection = ({ theme, setColorTheme, setDisplayMode }: ThemeShowcaseProps) => (
  <section className="py-20 md:py-28 bg-secondary-50 dark:bg-secondary-950 transition-colors duration-500" aria-label="Theme Showcase">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <SectionBadge text="Personalize Your Experience" icon={Palette} />
        <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900 dark:text-white mb-4">Instantly Switch <span className="text-primary-600 dark:text-primary-400">Themes</span></h2>
        <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">Try out beautiful color themes and display modes. Your changes are live!</p>
      </div>
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-full bg-secondary-200/70 dark:bg-secondary-800 p-1 shadow-inner">
          {DISPLAY_MODES.map(({ mode, name, icon: Icon }) => {
            const isSelected = theme.displayMode === mode;
            return (
              <button key={mode} onClick={() => setDisplayMode(mode as DisplayMode)} className={`flex items-center gap-2 px-4 py-2 font-semibold text-base rounded-full transition-all duration-300 focus-ring ${isSelected ? 'bg-primary-500 text-white shadow-md' : 'text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white'}`} aria-pressed={isSelected}>
                <Icon className="w-5 h-5" /><span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
        {THEME_SHOWCASE.map(({ key, name, colors }) => {
          const isSelected = theme.colorTheme === key;
          return (
            <button key={key} onClick={() => setColorTheme(key as ColorTheme)} className={`relative flex flex-col items-center justify-center cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 group focus-ring ${isSelected ? 'border-primary-500 shadow-2xl scale-105 bg-primary-50/80 dark:bg-secondary-900' : 'border-transparent hover:border-primary-300 hover:shadow-lg bg-white/60 dark:bg-secondary-800 dark:hover:bg-secondary-700'}`} aria-pressed={isSelected}>
              <div className="w-20 h-12 rounded-lg mb-3 flex items-center justify-center gap-1 shadow-inner bg-secondary-100 dark:bg-secondary-950">
                {colors.map(c => <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }}></div>)}
              </div>
              <span className={`text-base font-semibold text-center leading-tight transition-colors ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-400'}`}>{name}</span>
              {isSelected && <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1 shadow-lg"><Check className="w-4 h-4 text-white" /></div>}
            </button>
          );
        })}
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-secondary-900 transition-colors duration-500">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <SectionBadge text="Ready to Start Cooking?" icon={Users} />
      <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">Your Culinary Journey <span className="text-primary-600 dark:text-primary-400">Starts Here</span></h2>
      <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-12 max-w-3xl mx-auto">Join thousands of home cooks sharing their passion. Start exploring, creating, and sharing your favorite recipes today.</p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link to="/register"><Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg" leftIcon={<User className="w-5 h-5" />}>Create Free Account</Button></Link>
        <Link to="/login"><Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg" leftIcon={<Search className="w-5 h-5" />}>Sign In</Button></Link>
      </div>
    </div>
  </section>
);

// --- Reusable Components ---

const AngledDivider = ({ topColor, bottomColor, isGradient = false }: { topColor: string, bottomColor: string, isGradient?: boolean }) => (
  <div className={`relative h-20 md:h-32 ${topColor} transition-colors duration-500`}>
    <div className={`absolute inset-x-0 bottom-0 h-full ${bottomColor} transition-colors duration-500`} style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
    {isGradient && <div className={`absolute inset-x-0 bottom-0 h-full ${bottomColor}`} style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>}
  </div>
);

const SectionBadge = ({ text, icon: Icon }: { text: string; icon: React.ElementType }) => (
  <div className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full border bg-secondary-100/80 dark:bg-secondary-800/80 border-secondary-200 dark:border-secondary-700 shadow-sm">
    <Icon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
    <span className="text-base font-semibold text-secondary-700 dark:text-secondary-300">{text}</span>
  </div>
);

const FloatingShapes = () => (
  <>
    <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 15% 25%, var(--color-primary-400), transparent 30%), radial-gradient(circle at 85% 75%, var(--color-accent-500), transparent 30%)' }} />
    <div className="absolute inset-0 z-10 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
  </>
);

const RecipeGridSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-secondary-200 dark:bg-secondary-800 h-64 rounded-2xl mb-4"></div>
        <div className="bg-secondary-200 dark:bg-secondary-800 h-6 rounded w-3/4 mb-3"></div>
        <div className="bg-secondary-200 dark:bg-secondary-800 h-4 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-16">
    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
      <ChefHat className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-400">Error loading recipes</h3>
    <p className="text-secondary-600 dark:text-secondary-400">{message}</p>
  </div>
);

const NoRecipesMessage = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 mx-auto mb-6 bg-secondary-200 dark:bg-secondary-700 rounded-2xl flex items-center justify-center">
      <ChefHat className="w-10 h-10 text-secondary-400 dark:text-secondary-500" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-secondary-900 dark:text-white">No recipes available</h3>
    <p className="text-secondary-600 dark:text-secondary-400">Be the first to share a delicious recipe with our community!</p>
  </div>
);

// --- Custom Hooks ---

function useIntersectionObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }
    );
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useFeaturedRecipes(setRecipes: (r: Recipe[]) => void, setLoading: (l: boolean) => void, setError: (e: string | null) => void) {
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/recipes?limit=3&sortBy=rating&sortOrder=desc&_t=' + Date.now());
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRecipes(data.data?.recipes || data.recipes || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [setRecipes, setLoading, setError]);
}

function useAnimatedCounter(end: number, duration: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);
  return [count];
}

export default Home;