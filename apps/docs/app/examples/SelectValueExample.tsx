'use client';

import {
  Box,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusLight,
} from '@umami/react-zen';

const statuses = [
  { value: 'online', label: 'Online', variant: 'success' },
  { value: 'away', label: 'Away', variant: 'warning' },
  { value: 'busy', label: 'Busy', variant: 'destructive' },
  { value: 'offline', label: 'Offline', variant: 'muted' },
] as const;

function StatusLabel({ value }: { value: string }) {
  const status = statuses.find(item => item.value === value);

  return status ? <StatusLight variant={status.variant}>{status.label}</StatusLight> : null;
}

export function SelectValueExample() {
  return (
    <Box width="192px">
      <Select defaultValue="online">
        <SelectTrigger className="w-full">
          <SelectValue>{(value: string) => <StatusLabel value={value} />}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statuses.map(status => (
            <SelectItem key={status.value} value={status.value}>
              <StatusLabel value={status.value} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  );
}
