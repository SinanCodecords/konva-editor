#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const {exec} = require('child_process');

const sourceDir = path.join(__dirname, '../image-editor');
const destDir = path.join(process.cwd(), 'image-editor');

const requiredDependencies = {
    "konva": "^9.3.22",
    "lucide-react": "^0.525.0",
    "react-konva": "^19.0.7",
    "zundo": "^2.3.0",
    "zustand": "^5.0.6"
};

const installDependencies = (dependencies) => {
    return new Promise((resolve, reject) => {
        const command = `pnpm add ${dependencies.join(' ')}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing dependencies: ${error}`);
                reject(error);
                return;
            }
            console.log(stdout);
            console.error(stderr);
            resolve();
        });
    });
};

const main = async () => {
    const command = process.argv[2];

    if (command !== 'init') {
        console.log('Invalid command. Use "init" to initialize the image editor.');
        return;
    }

    try {
        // Remove destination directory if it exists to ensure a clean copy
        if (fs.existsSync(destDir)) {
            console.log('Removing existing image editor directory...');
            fs.removeSync(destDir);
        }

        // Copy the image-editor directory
        await fs.copy(sourceDir, destDir);
        console.log('Image editor copied to your project.');

        // Check and install dependencies
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = require(packageJsonPath);
            const dependencies = packageJson.dependencies || {};
            const devDependencies = packageJson.devDependencies || {};

            const allDependencies = {...dependencies, ...devDependencies};

            const missingDependencies = Object.keys(requiredDependencies).filter(dep => !allDependencies[dep]);

            if (missingDependencies.length > 0) {
                console.log('Installing missing dependencies...');
                await installDependencies(missingDependencies.map(dep => `${dep}@${requiredDependencies[dep]}`));
                console.log('Dependencies installed successfully.');
            } else {
                console.log('All required dependencies are already installed.');
            }
        } else {
            console.log('No package.json found. Skipping dependency check.');
            console.log('Please install the following dependencies manually:');
            console.log(Object.keys(requiredDependencies).map(dep => `${dep}@${requiredDependencies[dep]}`).join(' '));
        }

        console.log('Initialization complete!');

    } catch (error) {
        console.error('An error occurred during initialization:', error);
    }
};

main();