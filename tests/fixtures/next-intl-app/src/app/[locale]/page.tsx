import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  return <button>{t('pay')}</button>;
}
