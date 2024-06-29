import Image from 'next/image';
import styles from './Card.module.scss';

interface CardProps {
  name: string;
  imageUrl: string;
}

export default function Card({ name, imageUrl }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={`Logo of ${name}`}
          width={250} 
          height={250} 
          objectFit="cover" 
        />
      </div>
      <h2 className={styles.name}>{name}</h2>
    </div>
  );
}