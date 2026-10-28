import EditEntryClient from './EditEntryClient';

export default async function EditEntryPage({ params }) {
  const resolvedParams = await params;
  const entryId = resolvedParams.id;

  return <EditEntryClient entryId={entryId} />;
}