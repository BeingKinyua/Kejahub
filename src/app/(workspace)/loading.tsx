import { BuildingBlocksLoader } from '../../components/ui/BuildingBlocksLoader';

export default function WorkspaceLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <BuildingBlocksLoader
        variant="contained"
        size="md"
        label="Loading your property operations…"
      />
    </div>
  );
}
