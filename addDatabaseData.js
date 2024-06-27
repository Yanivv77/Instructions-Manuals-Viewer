require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs'); 


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


function getRandomImageUrl(width = 200, height = 200) {
  return `https://picsum.photos/${width}/${height}`;
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
    const importerIds = await Promise.all(importerNames.map(async (name) => {
      const data = {
        name: name,
        logoUrl: getRandomImageUrl(), 
      };
      const docRef = await importersRef.add(data);
      console.log(`Added importer: ${name}`);
      return docRef.id;
    }));

    // Add Brands
    const brandsRef = db.collection('brands');
    const brandIds = [];
    for (let i = 0; i < importerIds.length; i++) {
      const importerId = importerIds[i];
      for (let j = 1; j <= 5; j++) {
        const brandName = `מותג ${i * 5 + j}`;
        const brandData = {
          importerId: importerId,
          name: brandName,
          logoUrl: getRandomImageUrl(), // Use random image for logo
        };
        const docRef = await brandsRef.add(brandData);
        brandIds.push(docRef.id);
        console.log(`Added brand: ${brandName} for importer: ${importerNames[i]}`);
      }
    }

    // Add Products
    const productsRef = db.collection('products');
    const productIds = [];
    for (let i = 0; i < brandIds.length; i++) {
      const brandId = brandIds[i];
      for (let j = 1; j <= 3; j++) {
        const productName = `מוצר ${i * 3 + j}`;
        const productData = {
          brandId: brandId,
          name: productName,
          imageUrl: getRandomImageUrl(), // Use random image
        };
        const docRef = await productsRef.add(productData);
        productIds.push(docRef.id);
        console.log(`Added product: ${productName} for brand: ${i + 1}`);
      }
    }

    // Add Manuals (Manuals are now a subcollection of products)
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const manualName = `מדריך למוצר ${i + 1}`;

      const localPdfFilePath = `pdfExample.pdf`; // Your PDF file path

      const downloadURL = await uploadPDF(localPdfFilePath, manualName);

      const manualData = {
        name: manualName,
        imageUrl: getRandomImageUrl(),
        manualPdfFile: downloadURL,
      };

      await db.collection('products').doc(productId).collection('manuals').add(manualData);

      console.log(`Added manual: ${manualName} for product: ${i + 1}`);
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