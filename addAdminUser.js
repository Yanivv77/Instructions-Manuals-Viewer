require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');


console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key Length:', process.env.FIREBASE_PRIVATE_KEY.length);


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

async function addAdminUser() {
  try {
    const userDetails = {
      email: "yaniv@gmail.com",
      password: "yaniv123",
      firstName: "yaniv",
      lastName: "bialik"
    };

    const userRecord = await admin.auth().createUser({
      email: userDetails.email,
      password: userDetails.password,
      emailVerified: true
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Successfully created admin user:', userRecord.uid);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

addAdminUser().then(() => process.exit(0));