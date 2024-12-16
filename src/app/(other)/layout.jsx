import NavigationSetter from '@/history';
import Providers from '../providers/providers';

export const metadata = {
  title: 'Techdoc',
  description: 'Manage Docs & Build API Documentation',
};

export default function RootLayout({ children }) {
  return (
    <>
      <head>
        <link rel='icon' href='/favicon.svg' />
      </head>
      <Providers>{children}</Providers>
      <NavigationSetter />
    </>
  );
}
