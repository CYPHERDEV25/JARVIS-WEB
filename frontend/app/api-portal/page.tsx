import { redirect } from 'next/navigation';

export default function ApiPortalRoot() {
  redirect('/api-portal/projects');
}
