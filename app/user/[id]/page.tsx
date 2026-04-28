export default function UserPage({ params }: { params: { id: string } }) {
  return <div>User Page: {params.id}</div>;
}
