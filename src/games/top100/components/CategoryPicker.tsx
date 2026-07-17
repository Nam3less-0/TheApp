import { useMemo, useState } from 'react';
import { CATEGORY_GROUPS, getCategoryGroupId } from '../../../data/categories/groups';
import type { CategoryGroupId } from '../../../data/categories/groups';
import { GROUP_ACCENTS } from '../theme';
import type { Category } from '../types';
import { SearchIcon } from './Top100Icons';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  heading?: string;
  description?: string;
}

type FilterId = 'all' | CategoryGroupId;

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
      <div className="rounded-xl border border-dashed border-line-bright px-4 py-8 text-center">
        <p className="font-body text-sm text-text-mid">No categories remaining.</p>
        <p className="mt-1 font-mono text-[11px] text-text-low">All categories have been used</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1 font-body text-sm font-bold text-text-hi">{heading}</p>
      {description && (
        <p className="mb-4 font-body text-[13px] leading-relaxed text-text-mid">{description}</p>
      )}

      {selectedCategory && (
        <div
          className="mb-4 overflow-hidden rounded-xl border border-steel-blue/50 shadow-[0_0_24px_-8px_rgba(111,168,220,0.35),inset_0_0_0_1px_rgba(111,168,220,0.2)]"
          style={{
            background: `linear-gradient(135deg, ${GROUP_ACCENTS[getCategoryGroupId(selectedCategory.id)]?.from ?? '#6FA8DC'}18, #1A1E24)`,
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-steel-blue">
                Selected category
              </p>
              <p className="mt-0.5 truncate font-display text-base font-bold text-text-hi">
                {selectedCategory.title}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-text-low">
                {GROUP_ACCENTS[getCategoryGroupId(selectedCategory.id)]?.label ?? 'Category'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="shrink-0 rounded-lg border border-line/80 bg-surface/60 px-3 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
            >
              Change
            </button>
          </div>
        </div>
      )}

      <label className="relative mb-3 block" htmlFor="category-search">
        <span className="sr-only">Search categories</span>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-low" />
        <input
          id="category-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="w-full rounded-xl border border-line bg-deep/60 py-2.5 pl-10 pr-3.5 font-body text-sm text-text-hi outline-none placeholder:text-text-low focus-visible:border-steel-blue/50 focus-visible:ring-2 focus-visible:ring-steel-blue/25"
        />
      </label>

      <div
        className="top100-scroll-hidden -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-0.5"
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
          const accent = GROUP_ACCENTS[group.id];
          return (
            <FilterChip
              key={group.id}
              label={group.label}
              count={count}
              active={activeFilter === group.id}
              onClick={() => setActiveFilter(group.id)}
              accent={accent?.from}
            />
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line/80 bg-deep/30">
        <div className="top100-scroll max-h-[min(42vh,360px)] overflow-y-auto sm:max-h-[min(44vh,400px)] md:max-h-[min(46vh,440px)] lg:max-h-[min(48vh,480px)]">
          {filteredCategories.length === 0 ? (
            <p className="px-4 py-10 text-center font-body text-sm text-text-mid">
              No categories match your search.
            </p>
          ) : (
            groupedCategories.map((group) => (
              <section key={group.id} className="border-b border-line/60 last:border-b-0">
                {activeFilter === 'all' && group.label && (
                  <h3 className="sticky top-0 z-[1] flex items-center gap-2 border-b border-line/60 bg-deep/95 px-3.5 py-2 backdrop-blur-sm">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: GROUP_ACCENTS[group.id as CategoryGroupId]?.from ?? '#6FA8DC' }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
                      {group.label}
                    </span>
                    <span className="font-mono text-[10px] text-text-mid">{group.categories.length}</span>
                  </h3>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {group.categories.map((category) => {
                    const selected = selectedId === category.id;
                    const groupId = getCategoryGroupId(category.id);
                    const accent = GROUP_ACCENTS[groupId];

                    return (
                      <li key={category.id} className="border-b border-line/40 sm:[&:nth-child(odd)]:border-r">
                        <button
                          type="button"
                          onClick={() => onSelect(category.id)}
                          className={`group flex w-full items-start gap-3 px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue ${
                            selected
                              ? 'bg-steel-blue/12'
                              : 'hover:bg-surface/60'
                          }`}
                          aria-pressed={selected}
                        >
                          <span
                            className="mt-0.5 h-8 w-1 shrink-0 rounded-full transition-opacity group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(180deg, ${accent?.from ?? '#6FA8DC'}, ${accent?.to ?? '#3D7AAF'})`,
                              opacity: selected ? 1 : 0.5,
                            }}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-body text-[13px] font-semibold leading-snug text-text-hi">
                              {category.title}
                            </span>
                            <span className="mt-0.5 block font-mono text-[10px] text-text-low">
                              100 ranked items
                            </span>
                          </span>
                          {selected && (
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-steel-blue/20 font-mono text-[10px] text-steel-blue">
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
        {filteredCategories.length > 6 && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-7 bg-gradient-to-t from-deep to-transparent"
            aria-hidden="true"
          />
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
  accent,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-[12px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue ${
        active
          ? 'border-steel-blue/60 bg-steel-blue/15 text-text-hi shadow-[0_0_12px_-4px_rgba(111,168,220,0.4)]'
          : 'border-line bg-surface/60 text-text-mid hover:border-line-bright hover:text-text-hi'
      }`}
      style={active && accent ? { borderColor: `${accent}80` } : undefined}
    >
      {accent && !active && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
          aria-hidden="true"
        />
      )}
      {label}
      <span
        className={`font-mono text-[10px] ${active ? 'text-steel-blue' : 'text-text-low'}`}
      >
        {count}
      </span>
    </button>
  );
}
