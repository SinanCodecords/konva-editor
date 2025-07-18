#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../image-editor');
const destDir = path.join(process.cwd(), 'image-editor');


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

        console.log('Installing dependencies...');
        const { execa } = await import('execa');

        await execa('pnpm', ['install', 'canvas', 'react-konva', 'konva', 'use-image', 'zundo', 'zustand', 'lucide-react'], { stdio: 'inherit' });
        console.log('Core dependencies installed.');

        console.log('Adding shadcn-ui components...');
        await execa('pnpm', ['dlx', 'shadcn@latest', 'add', 'button', 'input', 'label', 'slider', 'select', 'separator', 'slider', 'switch', 'tabs', 'textarea'], {stdio: 'inherit'});
        console.log('Shadcn-ui components added.');

    } catch (error) {
        console.error('An error occurred during initialization:', error);
    }
};

main();