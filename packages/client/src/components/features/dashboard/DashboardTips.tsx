import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Tip {
    id: string;
    title: string;
    content: string;
    category: string;
    icon?: React.ReactNode;
}

interface DashboardTipsProps {
    tips?: Tip[];
}

export const DashboardTips: React.FC<DashboardTipsProps> = ({ tips: propTips }) => {
    const defaultTips: Tip[] = [
        {
            id: '1',
            title: 'Perfect Pasta',
            content: 'Always salt your pasta water generously. It should taste like the sea for the best flavor in your pasta.',
            category: 'Cooking Basics',
            icon: '🍝'
        },
        {
            id: '2',
            title: 'Knife Skills',
            content: 'Keep your knives sharp - dull knives are more dangerous as they require more force and can slip more easily.',
            category: 'Kitchen Safety',
            icon: '🔪'
        },
        {
            id: '3',
            title: 'Flavor Enhancer',
            content: 'Finish dishes with a splash of acid (lemon juice, vinegar) to brighten flavors and balance richness.',
            category: 'Flavor Tips',
            icon: '🍋'
        },
        {
            id: '4',
            title: 'Meat Resting',
            content: 'Always rest meat after cooking to allow juices to redistribute. For steaks, rest about 5 minutes per inch of thickness.',
            category: 'Protein Cooking',
            icon: '🥩'
        },
        {
            id: '5',
            title: 'Mise en Place',
            content: 'Prep and organize all ingredients before you start cooking to make the process smoother and more enjoyable.',
            category: 'Preparation',
            icon: '👨‍🍳'
        }
    ];

    const tips = propTips && propTips.length > 0 ? propTips : defaultTips;
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const nextTip = () => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    };

    const prevTip = () => {
        setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
    };

    return (
        <div className="glass-card bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-xl p-6 border border-surface-200/60 dark:border-surface-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-md">
                        <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                        Cooking Tips
                    </h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevTip}
                        className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                        aria-label="Previous tip"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-surface-500 dark:text-surface-400 px-2">
                        {currentTipIndex + 1}/{tips.length}
                    </span>
                    <button
                        onClick={nextTip}
                        className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                        aria-label="Next tip"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="transition-all duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentTipIndex * 100}%)` }}
                >
                    <div className="flex">
                        {tips.map((tip, index) => (
                            <div
                                key={tip.id}
                                className={cn(
                                    "min-w-full transition-opacity duration-500",
                                    index === currentTipIndex ? "opacity-100" : "opacity-0 absolute"
                                )}
                            >
                                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl">
                                            {tip.icon || '💡'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-surface-900 dark:text-white">
                                                    {tip.title}
                                                </h3>
                                                <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">
                                                    {tip.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {tip.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
                {tips.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTipIndex(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === currentTipIndex
                                ? "bg-amber-500 w-4"
                                : "bg-surface-300 dark:bg-surface-600 hover:bg-surface-400 dark:hover:bg-surface-500"
                        )}
                        aria-label={`Go to tip ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}; 