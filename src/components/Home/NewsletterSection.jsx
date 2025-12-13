import { Mail } from "lucide-react";
import NewsletterForm from "../NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="bg-gray-50 py-16 border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          اشترك في <span className="text-red-600">النشرة البريدية</span>
        </h2>
        <p className="text-gray-600 mb-12">
          كن أول من يحصل على أحدث العروض والمنتجات من 2M Technology.
        </p>

        {/* Newsletter Form with Mail Icon */}
        <div className="relative">
          <NewsletterForm variant="home" />
          <Mail className="z-0 text-gray-100 absolute -top-12 left-0 lg:-top-16 lg:left-20 -rotate-12 lg:h-[200px] lg:w-[200px] h-[100px] w-[100px]" />
        </div>
      </div>
    </section>
  );
}
