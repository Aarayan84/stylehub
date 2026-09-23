
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Store,
} from "lucide-react";

function About() {
  const storeInfo = {
    name: import.meta.env.VITE_STORE_NAME,
    tagline: import.meta.env.VITE_STORE_TAGLINE,
    email: import.meta.env.VITE_STORE_EMAIL,
    phone: import.meta.env.VITE_STORE_PHONE,
    whatsapp: import.meta.env.VITE_STORE_WHATSAPP,
    address: import.meta.env.VITE_STORE_ADDRESS,
    city: import.meta.env.VITE_STORE_CITY,
    hours: import.meta.env.VITE_STORE_HOURS,
    map: import.meta.env.VITE_STORE_MAP,
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
              About Us
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Welcome to {storeInfo.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              {storeInfo.tagline} We bring together stylish,
              comfortable, and affordable clothing for
              everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* About Store */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          {/* Shop Image */}
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src="/shop.jpg"
              alt={`${storeInfo.name} shop`}
              className="h-[380px] w-full object-cover sm:h-[480px]"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Our Story
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fashion made for everyday life.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
              {storeInfo.name} is a modern fashion store
              created for people who want to look good and
              feel comfortable without making fashion
              complicated.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              From everyday essentials to modern styles,
              we carefully select products that combine
              comfort, quality, and style.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              Whether you're shopping for yourself, your
              family, or someone special, we aim to make
              your shopping experience simple and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Store Information */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Get In Touch
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              We're here to help
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Have a question about an order, product, or
              anything else? Feel free to contact us.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <a
              href={`tel:${storeInfo.phone}`}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Phone size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900">
                Call Us
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {storeInfo.phone}
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${storeInfo.whatsapp.replace(
                /\D/g,
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <MessageCircle size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900">
                WhatsApp
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Chat with us
              </p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${storeInfo.email}`}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Mail size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900">
                Email Us
              </h3>

              <p className="mt-2 break-all text-sm text-gray-500">
                {storeInfo.email}
              </p>
            </a>

            {/* Hours */}
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Clock size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900">
                Business Hours
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                {storeInfo.hours}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-black md:grid-cols-2">
          {/* Address */}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <MapPin size={22} className="text-white" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Visit Our Store
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Come say hello
            </h2>

            <div className="mt-5 text-sm leading-7 text-gray-300">
              <p>{storeInfo.name}</p>
              <p>{storeInfo.address}</p>
              <p>{storeInfo.city}</p>
            </div>

            <a
              href={storeInfo.map}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              <MapPin size={16} />
              Get Directions
            </a>
          </div>

          {/* Store Info */}
          <div className="flex items-center justify-center bg-gray-900 p-7 sm:p-10">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
              <Store size={30} className="text-white" />

              <h3 className="mt-5 text-xl font-bold text-white">
                {storeInfo.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Your destination for stylish and comfortable
                everyday fashion.
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Store Hours
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  {storeInfo.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Credit */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Website
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Designed & developed by
          </p>

          <p className="mt-1 text-base font-bold text-gray-900">
            Aarayan
          </p>

          <p className="mt-1 text-xs text-gray-400">
            aarayan2005@gmail.com
          </p>

          <p className="mt-1 text-xs text-gray-400">
            MERN Stack Developer
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;