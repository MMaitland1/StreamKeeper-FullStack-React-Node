const fs = require('fs').promises;
const path = require('path');

// ============= CONFIGURATION VARIABLES =============
// Fill these values before running the script
const CONFIG = {
    // BaseUrlService.js PUBLIC_IP
    PUBLIC_IP: '',  // Leave empty for development/localhost

    // Backend .env variables
    TMDB_BASE_URL: '',
    TMDB_API_KEY: ''
};
// ================================================

const FILES = {
    baseUrlService: {
        path: './StreamKeeper-React/src/services/BaseUrlService.js',
        replacements: [
            {
                search: /const PUBLIC_IP = '';/,
                replace: () => `const PUBLIC_IP = '${CONFIG.PUBLIC_IP}';`
            }
        ]
    },
    envFile: {
        path: './StreamKeeper-Node-Backend/.env',
        content: () => `TMDB_BASE_URL=${CONFIG.TMDB_BASE_URL}
TMDB_API_KEY=${CONFIG.TMDB_API_KEY}`
    }
};

async function modifyFile(fileConfig) {
    try {
        const content = await fs.readFile(fileConfig.path, 'utf8');
        let newContent = content;

        for (const replacement of fileConfig.replacements) {
            newContent = newContent.replace(replacement.search, replacement.replace());
        }

        await fs.writeFile(fileConfig.path, newContent, 'utf8');
        console.log(`Successfully updated ${fileConfig.path}`);
    } catch (error) {
        console.error(`Error processing ${fileConfig.path}:`, error);
    }
}

async function createEnvFile(fileConfig) {
    try {
        await fs.writeFile(fileConfig.path, fileConfig.content(), 'utf8');
        console.log(`Successfully created ${fileConfig.path}`);
    } catch (error) {
        console.error(`Error creating ${fileConfig.path}:`, error);
    }
}

async function setup() {
    console.log('Starting project setup...');

    // Update BaseUrlService.js
    await modifyFile(FILES.baseUrlService);

    // Create .env file
    await createEnvFile(FILES.envFile);

    console.log('Setup completed!');
}

// Validate configuration before running
function validateConfig() {
    const missingValues = Object.entries(CONFIG)
        .filter(([key, value]) => value === '' && key !== 'PUBLIC_IP')
        .map(([key]) => key);

    if (missingValues.length > 0) {
        console.error('Error: The following configuration values are missing:');
        missingValues.forEach(key => console.error(`- ${key}`));
        console.error('\nPlease fill in these values in the CONFIG object at the top of the script.');
        process.exit(1);
    }
}

// Run setup
validateConfig();
setup();