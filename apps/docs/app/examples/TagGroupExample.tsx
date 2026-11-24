'use client';
import { Tag, TagGroup } from '@umami/react-zen';
import { useState } from 'react';

export function RemovableTagGroupExample() {
  const [tags, setTags] = useState(['JavaScript', 'TypeScript', 'Python']);

  return (
    <TagGroup label="Skills" onRemove={value => setTags(tags.filter(tag => tag !== value))}>
      {tags.map(tag => (
        <Tag key={tag} value={tag}>
          {tag}
        </Tag>
      ))}
    </TagGroup>
  );
}
