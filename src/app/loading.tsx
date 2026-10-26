import { BuildingBlocksLoader } from '../components/ui/BuildingBlocksLoader';

export default function RootLoading() {
  return (
    <BuildingBlocksLoader
      variant="fullscreen"
      size="lg"
      label="Preparing your workspace…"
    />
  );
}
