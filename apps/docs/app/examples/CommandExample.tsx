'use client';
import {
  Box,
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@umami/react-zen';
import { Calendar, Search, Settings, Smile, User } from 'lucide-react';
import { useState } from 'react';

export function CommandExample() {
  return (
    <Box border borderRadius="md" width="320px">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem icon={<Calendar />}>Calendar</CommandItem>
            <CommandItem icon={<Smile />}>Search emoji</CommandItem>
            <CommandItem icon={<Search />} isDisabled>
              Search web
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem icon={<User />}>Profile</CommandItem>
            <CommandItem icon={<Settings />}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Box>
  );
}

export function CommandDialogExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem icon={<Calendar />} onSelect={() => setIsOpen(false)}>
              Calendar
            </CommandItem>
            <CommandItem icon={<Smile />} onSelect={() => setIsOpen(false)}>
              Search emoji
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem icon={<User />} onSelect={() => setIsOpen(false)}>
              Profile
            </CommandItem>
            <CommandItem icon={<Settings />} onSelect={() => setIsOpen(false)}>
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
