import Link from "next/link";
import { categoryIcons } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { Container } from "@/components/layout/Container";

export function CategoryTiles() {
  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
              Shop by category
            </h2>
            <p className="mt-0.75 text-[13.5px] text-secondary">
              Everything for work, play, and building.
            </p>
          </div>
          <Link href="/products" className="whitespace-nowrap text-[13px] font-semibold text-accent hover:text-accent-hover">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon];
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-primary">{category.name}</span>
                <span className="text-xs text-tertiary">{category.count}</span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
