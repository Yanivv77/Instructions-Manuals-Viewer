# Instruction Manuals Viewer

## Overview
The Instruction Manuals Viewer is a web application built using Next.js 14+ designed to manage and display instruction manuals for various products. The website supports a hierarchy of importers, brands, product types, and models, with each model having associated instruction manuals provided as link URLs to PDF files.

**Live Demo:** [Instruction Manuals Viewer](https://instructions-manuals-viewer.vercel.app/)
**Admin Panel:** [Admin Interface](https://instructions-manuals-viewer.vercel.app/admin)  
**Admin Access:**  
Email: `yaniv@gmail.com`  
Password: `yaniv123`

## Objective
Build a responsive, SEO-friendly website that allows users to navigate through a hierarchy of importers, brands, and products to find specific instruction manuals in PDF format.

## Tech Stack
- **Frontend**: Next.js 14+, React, SCSS for styling
- **Backend**: Next.js API routes
- **Database**: Firebase Firestore or MongoDB
- **Deployment**: Dockerized environment, Vercel for live deployment

## Requirements
- The site must support Right-to-Left (RTL) layout for Hebrew.
- Utilize Server-Side Rendering (SSR) or Static Site Generation (SSG) for SEO purposes.
- Ensure the website is crawlable by search engines.

## Functional Specifications
- `src/app/page.tsx`: Lists all importers. Clicking an importer navigates to its brands.
- `src/app/[importer_id]/page.tsx`: Displays all brands under an importer. Clicking a brand navigates to its products.
- `src/app/[importer_id]/[brand_id]/page.tsx`: Lists all products under a brand. Clicking a product navigates to its details.
- `src/app/[importer_id]/[brand_id]/[product_id]/page.tsx`: Displays product details and a download button for the instruction manual.

## Features
- **Hierarchical Navigation:** Browse manuals by importer, brand, product, and model.
- **Detailed Product Information:** View product details, including the importer, brand, and associated manuals.
- **Manual Downloads:** Download or view manuals as PDF files.
- **Admin Panel:**  Manage importers, brands, products, and manuals.

1. **Prerequisites:**
   - Install Docker Desktop or Docker Engine.
   - Install Docker Compose.

2. **Clone the Repository:**
   ```bash
   git clone 
   cd your-repo-name

## Set Up Environment Variables
1. Create a file named `.env` at the root of the project.
Add your required environment variables (replace placeholders with actual values):

```plaintext
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
other environment variables thats in env envcopy.local

2. Firebase Service Account Key:
Download your Firebase service account key file (JSON format) from the Firebase console and place it at the root of the project.
Update the path in Dockerfile to match the name of your key file.

3. Build and Run:
docker-compose build
docker-compose up

Initializing Data

1. Run the addAdminUser.js script:
This script adds an admin user to your Firebase project.
You might need to adjust the script to match your Firebase authentication setup.

2. Run the addDatabaseData.js script:
This script populates your Firestore database with sample data.
You might need to modify this script to match your data structure and API functions.