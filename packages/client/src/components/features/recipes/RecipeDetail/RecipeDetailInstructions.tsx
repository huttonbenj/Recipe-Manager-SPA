import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { ListChecks, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface RecipeDetailInstructionsProps {
    recipe: Recipe;
}

export const RecipeDetailInstructions: React.FC<RecipeDetailInstructionsProps> = ({ recipe }) => {
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const instructions = recipe.instructions?.split('\n').filter(Boolean) || [];

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleStepClick = (index: number) => {
        setActiveStep(activeStep === index ? null : index);
    };

    // Estimate total time based on number of steps (3 minutes per step as a rough estimate)
    const estimatedTime = instructions.length * 3;

    return (
        <Card className="modern-card rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-300 mb-8">
            <CardHeader className="pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-brand-100/80 dark:bg-brand-900/80 backdrop-blur-sm shadow-sm">
                            <ListChecks className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                            Instructions
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {instructions.length > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs">
                                <Clock className="h-3.5 w-3.5" />
                                <span>~{estimatedTime} min</span>
                            </div>
                        )}
                        <button
                            onClick={toggleExpand}
                            className="p-1.5 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                            aria-label={isExpanded ? "Collapse instructions" : "Expand instructions"}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {instructions.length > 0 ? (
                            instructions.map((step, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative pl-12 pb-6",
                                        index < instructions.length - 1 && "border-l-2 border-brand-100 dark:border-brand-900/50 ml-4",
                                        activeStep === index && "border-brand-500 dark:border-brand-400"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm transition-all duration-300 cursor-pointer",
                                            activeStep === index
                                                ? "bg-brand-600 text-white scale-110"
                                                : "bg-brand-100 dark:bg-brand-900/70 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-800"
                                        )}
                                        onClick={() => handleStepClick(index)}
                                    >
                                        {index + 1}
                                    </div>
                                    <div
                                        className={cn(
                                            "p-4 rounded-lg bg-surface-50/80 dark:bg-surface-800/50 backdrop-blur-sm transition-all duration-300 cursor-pointer",
                                            activeStep === index && "bg-brand-50/80 dark:bg-brand-900/30 shadow-md"
                                        )}
                                        onClick={() => handleStepClick(index)}
                                    >
                                        <p className="text-surface-800 dark:text-surface-200 leading-relaxed">
                                            {step}
                                        </p>

                                        {activeStep === index && (
                                            <div className="mt-3 pt-3 border-t border-brand-100 dark:border-brand-900/50 flex justify-end">
                                                <span className="text-xs bg-brand-100 dark:bg-brand-900/70 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full">
                                                    Step {index + 1} of {instructions.length}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
                                    <ListChecks className="h-8 w-8 text-surface-400" />
                                </div>
                                <p className="text-surface-600 dark:text-surface-400">
                                    No instructions provided
                                </p>
                            </div>
                        )}
                    </div>

                    {instructions.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex justify-between items-center">
                            <div className="text-xs text-surface-500 dark:text-surface-400">
                                {instructions.length} steps total
                            </div>
                            {activeStep !== null && (
                                <button
                                    onClick={() => setActiveStep(null)}
                                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                                >
                                    Collapse all steps
                                </button>
                            )}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}; 