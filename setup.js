const fs = require('fs').promises;
const path = require('path');
//Run Commands:
//docker-compose --profile setup up --build
//docker-compose --profile main up --build

// ============= CONFIGURATION VARIABLES =============
// Fill these values before running the script
const CONFIG = {
    // BaseUrlService.js PUBLIC_IP
    PUBLIC_IP: '',  // Leave empty for development/localhost

    // Backend .env variables
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
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
    backendEnvFile: {
        path: './StreamKeeper-Node-Backend/.env',
        content: () => `TMDB_BASE_URL=${CONFIG.TMDB_BASE_URL}
TMDB_API_KEY=${CONFIG.TMDB_API_KEY}`
    },
    frontendEnvFile: {
        path: './StreamKeeper-React/.env',
        content: () => `# Enable HTTPS
HTTPS=false

# Port (optional, default is 3000)
PORT=3000

# If you have custom SSL certificate (optional)
SSL_CRT_FILE=ssl/certs/cert.crt
SSL_KEY_FILE=ssl/private/key.key`
    }
};

async function checkFileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

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
    console.log('Checking setup requirements...');

    const backendEnvExists = await checkFileExists(FILES.backendEnvFile.path);
    const frontendEnvExists = await checkFileExists(FILES.frontendEnvFile.path);
    const allConfigEmpty = Object.values(CONFIG).every(value => value === '');
    
    // Check if no backend .env and no config values
    if (!backendEnvExists && allConfigEmpty) {
        console.error('Error: No backend .env file exists and no configuration values provided.');
        console.error('Please either:');
        console.error('1. Fill in the CONFIG values in setup.js');
        console.error('2. Provide an existing .env file');
        process.exit(1);
    }

    if (allConfigEmpty && backendEnvExists) {
        console.log('No new configuration values provided and backend .env exists. Setup skipped.');
        return;
    }

    console.log('Starting project setup...');

    if (CONFIG.PUBLIC_IP) {
        await modifyFile(FILES.baseUrlService);
    }

    if (!backendEnvExists || CONFIG.TMDB_BASE_URL || CONFIG.TMDB_API_KEY) {
        await createEnvFile(FILES.backendEnvFile);
    }

    // Always create frontend .env if it doesn't exist
    if (!frontendEnvExists) {
        await createEnvFile(FILES.frontendEnvFile);
    }

    console.log('Setup completed!');
}

// Validate configuration before running
function validateConfig() {
    // Skip validation if all values are empty (handled in setup function)
    if (Object.values(CONFIG).every(value => value === '')) {
        return;
    }

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