'use client';
import {
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Kbd,
  KbdGroup,
  Row,
  Text,
} from '@umami/react-zen';
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CommandExample() {
  return (
    <Command className="max-w-sm rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function CommandDialogExample() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <Row alignItems="center" gap="3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <Text size="sm" color="muted-foreground">
          or press{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>J</Kbd>
          </KbdGroup>
        </Text>
      </Row>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Smile />
                <span>Search emoji</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => setOpen(false)}>
                <User />
                <span>Profile</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Settings />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
