import React from 'react';
import { List, Info, Clock } from 'lucide-react';
import { Textarea } from '../../../ui/Form/Textarea';

interface RecipeInstructionsProps {
    instructions: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ instructions, onChange, error }) => {
    const stepCount = instructions.split('\n').filter(line => line.trim()).length;

    return (
        <div className="space-y-4">
            {/* Helpful Tips */}
            <div className="bg-gradient-to-r from-warning-50 to-amber-50 dark:from-warning-950/20 dark:to-amber-950/20 rounded-xl p-4 border border-warning-200/50 dark:border-warning-800/50">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-warning-500 to-amber-600 shadow-sm">
                        <Info className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-warning-900 dark:text-warning-100 mb-1">
                            Pro Tips for Clear Instructions
                        </h4>
                        <ul className="text-sm text-warning-700 dark:text-warning-300 space-y-1">
                            <li>• Write each step on a new line</li>
                            <li>• Use action words (mix, bake, stir, etc.)</li>
                            <li>• Include temperatures and times</li>
                            <li>• Mention when to check for doneness</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Step Counter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-warning-500" />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        {stepCount} step{stepCount !== 1 ? 's' : ''} added
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                    <Clock className="h-3 w-3" />
                    <span>Press Enter for new step</span>
                </div>
            </div>

            {/* Enhanced Textarea */}
            <div className="relative">
                <Textarea
                    id="instructions"
                    label=""
                    placeholder="1. Preheat oven to 350°F (175°C). Line a baking sheet with parchment paper.

2. In a large bowl, cream together butter and sugar until light and fluffy, about 3-4 minutes.

3. Beat in eggs one at a time, then add vanilla extract.

4. In a separate bowl, whisk together flour, baking powder, and salt.

5. Gradually mix the dry ingredients into the wet ingredients until just combined.

6. Fold in chocolate chips.

7. Drop rounded tablespoons of dough onto prepared baking sheet, spacing 2 inches apart.

8. Bake for 10-12 minutes or until edges are lightly golden.

9. Cool on baking sheet for 5 minutes before transferring to a wire rack."
                    value={instructions}
                    onChange={(e) => onChange(e.target.value)}
                    error={error}
                    rows={12}
                    className="font-mono text-sm leading-relaxed pl-12"
                />

                {/* Line numbers overlay - only show when there's content */}
                {instructions.trim() && (
                    <div className="absolute left-3 top-3 pointer-events-none">
                        <div className="text-xs text-surface-300 dark:text-surface-600 font-mono leading-relaxed">
                            {instructions.split('\n').map((_, i) => (
                                <div key={i} className="h-6 flex items-center">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                <span>Quick actions:</span>
                <button
                    type="button"
                    onClick={() => {
                        const lines = instructions.split('\n');
                        const numbered = lines.map((line, i) => {
                            const trimmed = line.trim();
                            if (trimmed && !trimmed.match(/^\d+\./)) {
                                return `${i + 1}. ${trimmed}`;
                            }
                            return line;
                        });
                        onChange(numbered.join('\n'));
                    }}
                    className="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                    Auto-number steps
                </button>
                <button
                    type="button"
                    onClick={() => onChange(instructions + '\n\n')}
                    className="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                    Add step
                </button>
            </div>

            {/* Cooking Time Reminder */}
            <div className="bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-success-200/50 dark:border-success-800/50">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-success-600" />
                    <span className="text-sm text-success-700 dark:text-success-300">
                        <strong>Remember:</strong> Include cooking times, temperatures, and visual cues for best results!
                    </span>
                </div>
            </div>
        </div>
    );
}; 