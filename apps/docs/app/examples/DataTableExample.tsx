'use client';

import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  Checkbox,
  Column,
  DataColumn,
  DataTable,
  Row,
  SearchField,
  Skeleton,
} from '@umami/react-zen';
import { useState } from 'react';

interface Member {
  id: number;
  name: string;
  title: string;
  email: string;
  joined: string;
}

const members: Member[] = [
  { id: 1, name: 'Bob', title: 'CEO', email: 'bob@aol.com', joined: '2019-03-14' },
  { id: 2, name: 'Fred', title: 'VP Marketing', email: 'fred@aol.com', joined: '2021-07-02' },
  { id: 3, name: 'Ted', title: 'Engineer', email: 'ted@aol.com', joined: '2023-01-19' },
  { id: 4, name: 'Alice', title: 'Designer', email: 'alice@aol.com', joined: '2020-11-30' },
  { id: 5, name: 'Carol', title: 'Engineer', email: 'carol@aol.com', joined: '2022-05-08' },
  { id: 6, name: 'Dave', title: 'Support', email: 'dave@aol.com', joined: '2024-02-21' },
  { id: 7, name: 'Erin', title: 'Engineer', email: 'erin@aol.com', joined: '2018-09-10' },
  { id: 8, name: 'Frank', title: 'Sales', email: 'frank@aol.com', joined: '2023-08-27' },
];

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export function DataTableSortingExample() {
  return (
    <DataTable data={members.slice(0, 5)} defaultSorting={[{ id: 'name', desc: false }]}>
      <DataColumn id="name" label="Name" sortable />
      <DataColumn id="title" label="Title" sortable />
      <DataColumn<Member> id="joined" label="Joined" sortable value={row => new Date(row.joined)}>
        {row => formatDate(row.joined)}
      </DataColumn>
    </DataTable>
  );
}

export function DataTableFilterExample() {
  const [search, setSearch] = useState('');

  return (
    <Column gap="4" width="100%">
      <SearchField
        aria-label="Search members"
        placeholder="Search members"
        value={search}
        onValueChange={setSearch}
        autoComplete="off"
      />
      <DataTable data={members} filter={search} emptyState="No members match your search.">
        <DataColumn id="name" label="Name" />
        <DataColumn id="title" label="Title" />
        <DataColumn id="email" label="Email" />
      </DataTable>
    </Column>
  );
}

export function DataTablePaginationExample() {
  return (
    <DataTable data={members} pageSize={3}>
      <DataColumn id="name" label="Name" sortable />
      <DataColumn id="title" label="Title" />
      <DataColumn id="email" label="Email" />
    </DataTable>
  );
}

const initials = (name: string) => name.slice(0, 2).toUpperCase();

export function DataTableCustomCardExample() {
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Column gap="4" width="100%" alignItems="start">
      <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
        Reload
      </Button>
      <DataTable
        data={members.slice(0, 4)}
        displayMode="cards"
        cardMinWidth="240px"
        selectionMode="multiple"
        loading={loading}
        loadingRows={4}
        renderCard={(member: Member, { isSelected, toggleSelected, cells }) => (
          <Card size="sm" className={isSelected ? 'ring-2 ring-primary' : undefined}>
            <CardContent>
              <Row gap="3" alignItems="center">
                <Avatar>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <Column flexGrow="1" minWidth="0">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-muted-foreground">{member.title}</span>
                </Column>
                <Checkbox
                  aria-label={`Select ${member.name}`}
                  checked={isSelected}
                  onCheckedChange={checked => toggleSelected(checked)}
                />
              </Row>
              <div className="mt-3 truncate">{cells.email}</div>
            </CardContent>
          </Card>
        )}
        renderCardSkeleton={() => (
          <Card size="sm">
            <CardContent>
              <Row gap="3" alignItems="center">
                <Skeleton className="size-8 rounded-full" />
                <Column gap="1" flexGrow="1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </Column>
              </Row>
              <Skeleton className="mt-3 h-4 w-3/4" />
            </CardContent>
          </Card>
        )}
      >
        <DataColumn id="name" label="Name" />
        <DataColumn<Member> id="email" label="Email">
          {row => <a href={`mailto:${row.email}`}>{row.email}</a>}
        </DataColumn>
      </DataTable>
    </Column>
  );
}
