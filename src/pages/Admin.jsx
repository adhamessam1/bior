import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardAdmin from "../components/Admin/DashboardAdmin";
import ProductsAdmin from "../components/Admin/ProductsAdmin";
import CategoriesAdmin from "../components/Admin/CategoriesAdmin";
import HomeAdmin from "../components/Admin/HomeAdmin";
import NavbarAdmin from "../components/Admin/NavbarAdmin";
import FeaturesAdmin from "../components/Admin/FeaturesAdmin";
import FooterAdmin from "../components/Admin/FooterAdmin";
import SettingsAdmin from "../components/Admin/SettingsAdmin";
import SEOAdmin from "../components/Admin/SEOAdmin";

function Admin() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        await checkAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
      }

      setCheckingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    setCheckingAuth(true);

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);

    if (currentSession?.user) {
      await checkAdmin(currentSession.user.id);
    } else {
      setIsAdmin(false);
    }

    setCheckingAuth(false);
  };

  const checkAdmin = async (userId) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Admin check error:", error);
      setIsAdmin(false);
      return false;
    }

    const allowed = Boolean(data);

    setIsAdmin(allowed);

    return allowed;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginError("");

    if (!email.trim() || !password) {
      setLoginError("من فضلك أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoadingLogin(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Admin login error:", error);
      setLoginError(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة."
      );
      setLoadingLogin(false);
      return;
    }

    const allowed = await checkAdmin(data.user.id);

    if (!allowed) {
      await supabase.auth.signOut();

      setLoginError(
        "هذا الحساب ليس لديه صلاحية الدخول إلى لوحة التحكم."
      );

      setLoadingLogin(false);
      return;
    }

    setSession(data.session);
    setIsAdmin(true);
    setLoadingLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSession(null);
    setIsAdmin(false);
    setActiveSection("dashboard");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardAdmin />;

      case "products":
        return <ProductsAdmin />;

      case "categories":
        return <CategoriesAdmin />;

      case "home":
        return <HomeAdmin />;

      case "navbar":
        return <NavbarAdmin />;

      case "features":
        return <FeaturesAdmin />;

      case "footer":
        return <FooterAdmin />;

      case "settings":
        return <SettingsAdmin />;

      case "seo":
        return <SEOAdmin />;

      default:
        return <DashboardAdmin />;
    }
  };

  if (checkingAuth) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gray-50 px-6"
      >
        <p className="text-sm text-gray-500">
          جاري التحقق من صلاحية الدخول...
        </p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10"
      >
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white">
              B
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              لوحة تحكم BIOR
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              تسجيل الدخول لإدارة الموقع
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {loginError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingLogin ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            هذه الصفحة مخصصة لإدارة موقع BIOR فقط.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              لوحة تحكم BIOR
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              إدارة الموقع والمحتوى
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 sm:block">
              {session.user?.email}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <main className="min-w-0 flex-1">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Admin;