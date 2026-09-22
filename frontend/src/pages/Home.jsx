import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
} from "lucide-react";

function Home() {
  const clothingCategories = [
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22",
      path: "/products?gender=Men&type=Clothing",
    },
    {
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      path: "/products?gender=Women&type=Clothing",
    },
    {
      name: "Kids",
      image:
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4",
      path: "/products?gender=Kids&type=Clothing",
    },
  ];

  const generalCategories = [
    {
      name: "Water Bottles",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      category: "Water Bottles",
    },
    {
      name: "Kitchen & Storage",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
      category: "Kitchen Items",
    },
    {
      name: "Home & Utility",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      category: "Home & Utility",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery to your doorstep.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      description:
        "Your information stays safe and protected.",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description:
        "Simple returns for a hassle-free experience.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "We're here to help whenever you need us.",
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
                Sushil Style Hub
              </p>

              <h1 className="max-w-xl text-4xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Style, essentials & everyday value.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                Shop clothing for the whole family along
                with useful household, kitchen, kids, and
                everyday products.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Shop Everything
                </Link>

                <Link
                  to="/products?type=General"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  General Store
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050"
                alt="Sushil Style Hub"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />

              <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-3 shadow-lg">
                <p className="text-xs font-medium text-gray-500">
                  Sushil Style Hub
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-900">
                  Everything for everyday life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clothing */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Clothing
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Fashion for everyone
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {clothingCategories.map(
            (category) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-[400px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-2xl font-bold text-white">
                    {category.name}
                  </p>

                  <p className="mt-1 text-sm text-white/80">
                    Shop Collection →
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* General Store */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                99 Store
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Everyday essentials
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Discover useful products for your kitchen,
                home, family, and everyday needs.
              </p>
            </div>

            <Link
              to="/products?type=General"
              className="text-sm font-semibold text-gray-900 underline underline-offset-4"
            >
              View All →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {generalCategories.map(
              (category) => (
                <Link
                  key={category.name}
                  to={`/products?type=General&category=${encodeURIComponent(
                    category.category
                  )}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Shop Now →
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Promotion */}
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
            Sushil Style Hub
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            More products. More convenience.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            From clothes to everyday essentials, find
            useful products at one place.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Icon
                    size={21}
                    className="text-gray-900"
                  />
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Home;