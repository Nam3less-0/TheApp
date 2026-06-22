import { useMemo, useState } from 'react';
import { CATEGORY_GROUPS, getCategoryGroupId } from '../../../data/categories/groups';
import type { Category } from '../types';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  heading?: string;
  description?: string;
}

type FilterId = 'all' | (typeof CATEGORY_GROUPS)[number]['id'];

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

export default function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  heading = 'First category',
  description,
}: CategoryPickerProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const selectedCategory = categories.find((c) => c.id === selectedId);

  const availableGroupIds = useMemo(() => {
    const ids = new Set(categories.map((c) => getCategoryGroupId(c.id)));
    return CATEGORY_GROUPS.filter((g) => ids.has(g.id));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const q = normalizeQuery(query);
    return categories.filter((category) => {
      const matchesQuery =
        !q ||
        category.title.toLowerCase().includes(q) ||
        category.id.replace(/-/g, ' ').includes(q);
      const matchesFilter =
        activeFilter === 'all' || getCategoryGroupId(category.id) === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [categories, query, activeFilter]);

  const groupedCategories = useMemo(() => {
    if (activeFilter !== 'all') {
      return [{ id: activeFilter, label: '', categories: filteredCategories }];
    }

    const groups = availableGroupIds
      .map((group) => ({
        ...group,
        categories: filteredCategories.filter(
          (c) => getCategoryGroupId(c.id) === group.id,
        ),
      }))
      .filter((g) => g.categories.length > 0);

    return groups;
  }, [activeFilter, availableGroupIds, filteredCategories]);

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-bright px-4 py-6 text-center font-body text-sm text-text-mid">
        No categories remaining.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-1 font-body text-sm font-bold text-text-hi">{heading}</p>
      {description && (
        <p className="mb-3 font-body text-[13px] text-text-mid">{description}</p>
      )}

      {selectedCategory && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-steel-blue bg-surface px-3.5 py-3 shadow-[0_0_0_1px_#6FA8DC_inset]">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel-blue">
              Selected
            </p>
            <p className="truncate font-body text-sm font-bold text-text-hi">
              {selectedCategory.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="shrink-0 rounded-lg border border-line px-2.5 py-1 font-mono text-[11px] text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            Clear
          </button>
        </div>
      )}

      <label className="sr-only" htmlFor="category-search">
        Search categories
      </label>
      <input
        id="category-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search categories…"
        className="mb-3 w-full rounded-xl border border-line bg-deep px-3.5 py-2.5 font-body text-sm text-text-hi outline-none placeholder:text-text-low focus-visible:border-steel-blue focus-visible:ring-1 focus-visible:ring-steel-blue"
      />

      <div
        className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-0.5"
        role="tablist"
        aria-label="Filter categories by topic"
      >
        <FilterChip
          label="All"
          count={categories.length}
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        {availableGroupIds.map((group) => {
          const count = categories.filter(
            (c) => getCategoryGroupId(c.id) === group.id,
          ).length;
          return (
            <FilterChip
              key={group.id}
              label={group.label}
              count={count}
              active={activeFilter === group.id}
              onClick={() => setActiveFilter(group.id)}
            />
          );
        })}
      </div>

      <div className="max-h-[min(52vh,420px)] overflow-y-auto rounded-xl border border-line bg-deep/40">
        {filteredCategories.length === 0 ? (
          <p className="px-4 py-8 text-center font-body text-sm text-text-mid">
            No categories match your search.
          </p>
        ) : (
          groupedCategories.map((group) => (
            <section key={group.id} className="border-b border-line last:border-b-0">
              {activeFilter === 'all' && group.label && (
                <h3 className="sticky top-0 z-[1] border-b border-line bg-deep/95 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low backdrop-blur-sm">
                  {group.label}
                  <span className="ml-2 text-text-mid">{group.categories.length}</span>
                </h3>
              )}
              <ul>
                {group.categories.map((category) => {
                  const selected = selectedId === category.id;
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(category.id)}
                        className={`flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue ${
                          selected
                            ? 'bg-steel-blue/10 text-text-hi'
                            : 'hover:bg-surface/80'
                        }`}
                        aria-pressed={selected}
                      >
                        <span className="min-w-0 font-body text-sm font-semibold leading-snug">
                          {category.title}
                        </span>
                        {selected && (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-steel-blue">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      <p className="mt-2 font-mono text-[11px] text-text-low">
        {filteredCategories.length} of {categories.length} shown
      </p>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-[12px] font-semibold transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue ${
        active
          ? 'border-steel-blue bg-steel-blue/15 text-text-hi'
          : 'border-line bg-surface text-text-mid hover:border-line-bright hover:text-text-hi'
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] ${active ? 'text-steel-blue' : 'text-text-low'}`}
      >
        {count}
      </span>
    </button>
  );
}
