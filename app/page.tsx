import { useTranslations } from 'next-intl';
import Image from "next/image";

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
