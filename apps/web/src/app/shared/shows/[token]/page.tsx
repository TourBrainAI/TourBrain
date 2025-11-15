import { notFound } from "next/navigation";
import { SharedShowView } from "./SharedShowView";

interface SharedShowPageProps {
  params: { token: string };
}

export default async function SharedShowPage({ params }: SharedShowPageProps) {
  // The actual data fetching will be done client-side in the SharedShowView component
  // This is because we don't have access to the database from the server-side in shared views

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SharedShowView token={params.token} />
      </div>
    </div>
  );
}
