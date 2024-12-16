import { usePathname } from 'next/navigation';

export default function customPathnameHook() {
  const pathName = usePathname();
  return { pathname: pathName };
}
