import React, { useState, useEffect } from 'react'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/firebase/firebase.config';
import styles from './PdfUpload.module.scss'; 

interface PdfUploadProps {
  onUpload: (url: string) => void;
  isPdfUploaded: boolean; 
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onUpload, isPdfUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null); 
  const [isUploaded, setIsUploaded] = useState(false); 

  const storage = getStorage(app); 
  
  useEffect(() => {
    setIsUploaded(isPdfUploaded); 
  }, [isPdfUploaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a PDF file.');
      return; 
    }

    setIsUploading(true); 
    setUploadError(null); 

    try {
      const storageRef = ref(storage, `manuals/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file); 

      await uploadTask; 
      const downloadURL = await getDownloadURL(storageRef); 

      onUpload(downloadURL); 
      setFile(null);
      setIsUploading(false);
      setIsUploaded(true); 
    } catch (error: any) { 
      setUploadError('Error uploading file: ' + error.message);
      setIsUploading(false);
    } 
  };

  return (
    <div className={styles.pdfUploadContainer}>
    
      {!isUploaded && ( 
        <>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </>
      )}

      
      {uploadError && <div className={styles.error}>{uploadError}</div>} 
      {isUploaded && <div className={styles.success}>קובץ  עלה בהצלחה</div>}
    </div>
  );
};

export default PdfUpload;