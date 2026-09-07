import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

function DashboardAdmin() {
  const [stats, setStats] = useState({
    products: 0,
    availableProducts: 0,
    newProducts: 0,
    categories: 0,
    visibleCategories: 0,
    featuredProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [
        productsResult,
        availableProductsResult,
        newProductsResult,
        categoriesResult,
        visibleCategoriesResult,
        featuredProductsResult,
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_available", true),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("isNew", true),

        supabase
          .from("categories")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("categories")
          .select("*", { count: "exact", head: true })
          .eq("is_visible", true),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_featured", true),
      ]);

      const results = [
        productsResult,
        availableProductsResult,
        newProductsResult,
        categoriesResult,
        visibleCategoriesResult,
        featuredProductsResult,
      ];

      const hasError = results.some((result) => result.error);

      if (hasError) {
        console.error("Dashboard stats error:", results);
      }

      setStats({
        products: productsResult.count || 0,
        availableProducts: availableProductsResult.count || 0,
        newProducts: newProductsResult.count || 0,
        categories: categoriesResult.count || 0,
        visibleCategories: visibleCategoriesResult.count || 0,
        featuredProducts: featuredProductsResult.count || 0,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "إجمالي المنتجات",
      value: stats.products,
      icon: "👗",
      description: "كل المنتجات الموجودة",
    },
    {
      title: "المنتجات المتاحة",
      value: stats.availableProducts,
      icon: "✅",
      description: "منتجات ظاهرة للعملاء",
    },
    {
      title: "المنتجات الجديدة",
      value: stats.newProducts,
      icon: "🆕",
      description: "منتجات مضافة كجديدة",
    },
    {
      title: "إجمالي الأقسام",
      value: stats.categories,
      icon: "🗂️",
      description: "كل أقسام المتجر",
    },
    {
      title: "الأقسام الظاهرة",
      value: stats.visibleCategories,
      icon: "👀",
      description: "الأقسام المعروضة بالموقع",
    },
    {
      title: "المنتجات المميزة",
      value: stats.featuredProducts,
      icon: "⭐",
      description: "منتجات مميزة بالموقع",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          مرحبًا بك في لوحة تحكم BIOR 👋
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          نظرة سريعة على حالة المنتجات والأقسام في المتجر.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className="mt-3 text-3xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded bg-gray-200" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                {card.icon}
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardAdmin;