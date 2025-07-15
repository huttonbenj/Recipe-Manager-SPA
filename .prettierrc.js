module.exports = {
    semi: false,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    endOfLine: 'lf',
    quoteProps: 'as-needed',
    jsxSingleQuote: true,
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'css',
    vueIndentScriptAndStyle: false,
    embeddedLanguageFormatting: 'auto',
    singleAttributePerLine: false,
    overrides: [
        {
            files: '*.json',
            options: {
                parser: 'json',
                trailingComma: 'none',
            },
        },
        {
            files: '*.md',
            options: {
                parser: 'markdown',
                proseWrap: 'always',
                printWidth: 80,
            },
        },
        {
            files: '*.yml',
            options: {
                parser: 'yaml',
                tabWidth: 2,
            },
        },
        {
            files: '*.yaml',
            options: {
                parser: 'yaml',
                tabWidth: 2,
            },
        },
    ],
} 