import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "كيف تختار لابتوب الألعاب المثالي في 2025",
      image: "/blog/Games.webp",
      category: "دليل الشراء",
      date: "2 يناير 2025",
      excerpt:
        "اكتشف أهم العوامل التي يجب مراعاتها عند اختيار لابتوب ألعاب، من أداء كرت الشاشة إلى أنظمة التبريد...",
      readTime: "5 دقائق قراءة",
    },
    {
      id: 2,
      title: "أفضل 5 لوحات مفاتيح ميكانيكية للمبرمجين",
      image: "/blog/keyboards.webp",
      category: "إكسسوارات",
      date: "4 يناير 2025",
      excerpt:
        "اعثر على لوحة المفاتيح المثالية لتعزيز تجربة البرمجة لديك من خلال دليلنا الشامل...",
      readTime: "4 دقائق قراءة",
    },
    {
      id: 3,
      title: "نصائح لصيانة اللابتوب وإطالة عمره",
      image: "/blog/maintenance.webp",
      category: "صيانة",
      date: "5 يناير 2025",
      excerpt:
        "تعرف على أهم ممارسات الصيانة للحفاظ على أداء اللابتوب الخاص بك وإطالة عمره الافتراضي...",
      readTime: "6 دقائق قراءة",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50" dir="rtl">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black text-gray-800 mb-4">مدونة التقنية</h1>
        <p className="text-xl text-gray-600">
          أحدث الأخبار والدلائل والنصائح حول أجهزة اللابتوب والإكسسوارات
        </p>
      </div>

      {/* Categories Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {["كل المقالات", "أدلة الشراء", "مراجعات", "إكسسوارات", "صيانة"].map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full ${cat === "كل المقالات"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 relative w-full h-64 md:w-[384px]">
              <Image
                src="/blog/distinct.webp"
                alt="مقال مميز"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <span className="text-blue-500 font-semibold">مقال مميز</span>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                الدليل الشامل لمواصفات اللابتوب
              </h2>
              <p className="mt-4 text-gray-600">
                فهم مواصفات اللابتوب لا يجب أن يكون معقدًا. في هذا الدليل الشامل نشرح لك كل المواصفات المهمة التي يجب معرفتها قبل الشراء...
              </p>
              <div className="mt-6">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  اقرأ المزيد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-blue-500 font-semibold">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{post.date}</span>
                <button className="text-blue-500 hover:text-blue-600 font-semibold">
                  اقرأ المزيد ←
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">كن على اطلاع دائم</h3>
        <p className="text-gray-600 mb-6">
          اشترك في النشرة البريدية ليصلك أحدث أخبار التقنية والعروض الحصرية
        </p>
        <NewsletterForm variant="default" />
      </div>
    </div>
  );
};

export default BlogPage;
