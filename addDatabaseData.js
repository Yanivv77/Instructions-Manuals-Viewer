require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const fetch = require('node-fetch'); 

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const storage = admin.storage();
const pexelsApiKey = process.env.PEXELS_API_KEY;

async function getRandomImageUrl(query = 'product', width = 250, height = 250) {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: {
        'Authorization': `${pexelsApiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium; 
    } else {
      console.warn('No images found for the given query on Pexels. Using fallback image.');
      return 'https://picsum.photos/250/250'; 
    }

  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return 'https://picsum.photos/250/250'; 
  }
}

async function uploadPDF(localFilePath, manualName) {
  const bucket = storage.bucket(); 

  const fileName = `${manualName.replace(/\s+/g, '_')}_${Date.now()}.pdf`; 
  const fileUpload = bucket.file(`manuals/${fileName}`); 

  const fileStream = fs.createReadStream(localFilePath); 

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(fileUpload.createWriteStream({
        metadata: {
          contentType: 'application/pdf',
        },
        public: true, 
        resumable: false, 
      }))
      .on('error', (error) => {
        console.error('Error uploading PDF:', error); 
        reject(error); 
      })
      .on('finish', async () => {
        
        const [downloadURL] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2491', 
        });

        console.log(`Uploaded PDF ${fileName} to Firebase Storage. Download URL:`, downloadURL);
        resolve(downloadURL);
      });
  });
}

async function addSampleData() {
  try {
    // Add Importers
    const importersRef = db.collection('importers');
    const importerNames = ["סאני", "אלקטרה", "ברימאג", "דיפלומט", "היפרטרוניקס"];

    const importerIds = await Promise.all(
      importerNames.map(async (name) => {
        const logoUrl = await getRandomImageUrl(`importer logo ${name}`);
        const importerData = {
          name: name,
          logoUrl: logoUrl,
          createdAt: new Date(), // Add createdAt field
        };
        const docRef = await importersRef.add(importerData);
        console.log(`Added importer: ${name}`);
        return docRef.id;
      })
    );

    // Add Brands
    const brandsRef = db.collection('brands');
    const brandIds = [];

    for (let i = 0; i < importerIds.length; i++) {
      const importerId = importerIds[i];
      const importerName = importerNames[i]; // Get the importer name

      for (let j = 1; j <= 5; j++) {
        const brandName = `מותג ${i * 5 + j}`;
        const logoUrl = await getRandomImageUrl(`brand logo ${brandName}`);
        const brandData = {
          importerId: importerId,
          importerName: importerName, // Add importerName
          name: brandName,
          logoUrl: logoUrl,
          createdAt: new Date(), // Add createdAt field
        };
        const docRef = await brandsRef.add(brandData);
        brandIds.push(docRef.id);
        console.log(`Added brand: ${brandName} for importer: ${importerName}`);
      }
    }

    
    const productsRef = db.collection('products');
    const productIds = [];

    for (let i = 0; i < brandIds.length; i++) {
      const brandId = brandIds[i];
      
      const brand = await db.collection('brands').doc(brandId).get();
      const brandName = brand.data()?.name;

      for (let j = 1; j <= 3; j++) {
        const productName = `מוצר ${i * 3 + j}`;
        const imageUrl = await getRandomImageUrl(`product logo ${productName}`);
        const productData = {
          brandId: brandId,
          brandName: brandName, 
          name: productName,
          imageUrl: imageUrl,
          createdAt: new Date(), 
        };
        const docRef = await productsRef.add(productData);
        productIds.push(docRef.id);
        console.log(`Added product: ${productName} for brand: ${brandName}`);
      }
    }

    // Add Manuals
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
     
      const product = await db.collection('products').doc(productId).get();
      const productName = product.data()?.name; 

      const manualName = `מדריך למוצר ${i + 1}`;
      const localPdfFilePath = `pdfExample.pdf`;
      const downloadURL = await uploadPDF(localPdfFilePath, manualName);

      const manualData = {
        productId: productId, 
        productName: productName, 
        name: manualName,
        manualPdfFile: downloadURL,
        createdAt: new Date(),
      };

      await db.collection('products').doc(productId).collection('manuals').add(manualData);

      console.log(`Added manual: ${manualName} for product: ${productName}`);
    }

    console.log('Sample data addition completed successfully');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData().then(() => {
  console.log('Script execution completed');
  process.exit(0);
});