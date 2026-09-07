function AdminSidebar({ activeSection, onSectionChange }) {
  const sections = [
    {
      id: "dashboard",
      label: "الرئيسية",
      icon: "📊",
    },
    {
      id: "products",
      label: "المنتجات",
      icon: "👗",
    },
    {
      id: "categories",
      label: "الأقسام",
      icon: "🗂️",
    },
    {
      id: "home",
      label: "الصفحة الرئيسية",
      icon: "🏠",
    },
    {
      id: "navbar",
      label: "القائمة العلوية",
      icon: "🧭",
    },
    {
      id: "features",
      label: "المميزات",
      icon: "⭐",
    },
    {
      id: "footer",
      label: "الفوتر",
      icon: "📞",
    },
    {
      id: "settings",
      label: "إعدادات الموقع",
      icon: "⚙️",
    },
    {
      id: "seo",
      label: "SEO",
      icon: "🔍",
    },
  ];

  return (
    <aside className="w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:w-64">
      <div className="mb-4 border-b border-gray-100 px-3 pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          BIOR Admin
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          لوحة التحكم
        </p>
      </div>

      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span className="text-base">
                {section.icon}
              </span>

              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;