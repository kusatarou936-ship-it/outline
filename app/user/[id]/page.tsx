export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function UserPage({ params }: { params: { id: string } }) {
  return <div>User Page: {params.id}</div>;
}
