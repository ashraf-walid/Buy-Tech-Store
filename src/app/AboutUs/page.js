import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "عضو الفريق 1",
      role: "المؤسس ومدير المبيعات",
      image: "/aboutUs/profile.webp"
    },
    {
      name: "عضو الفريق 2",
      role: "أخصائي الدعم الفني",
      image: "/aboutUs/profile-2.webp"
    }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 bg-gray-50" dir="rtl">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative w-full h-80">
            <Image
              src="/aboutUs/AboutUs.avif"
              alt="متجرنا"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-60 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-black text-white text-center px-4">
                مرحبًا بكم في متجر التقنية الخاص بنا
              </h1>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">رسالتنا</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            نسعى لتقديم أفضل أجهزة اللابتوب المستوردة بأفضل الأسعار التنافسية في السوق، لنضمن لكل عميل الحصول على الجهاز المثالي دون التضحية بالجودة أو الميزانية.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">قصتنا</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                تأسس متجرنا في عام 2022 برؤية واضحة: جعل أجهزة اللابتوب عالية الجودة في متناول الجميع. خلال عامين فقط، بنينا سمعة قوية بتقديم مجموعة واسعة من الأجهزة المستوردة بأسعار تنافسية في دمياط الجديدة.
              </p>
              <p>
                ما يميزنا هو التزامنا بالشفافية، وسرعة الخدمة، والدعم الشامل للعملاء. لا نقتصر على علامات تجارية أو موديلات محددة، بل نبحث عن الجهاز الأنسب لكل عميل حسب احتياجاته وميزانيته.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">الشفافية</h3>
            <p className="text-gray-600">
              نؤمن بالوضوح التام في المنتجات والأسعار، لتتخذ قرارك بثقة واطمئنان.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">أفضل الأسعار</h3>
            <p className="text-gray-600">
              نستورد الأجهزة مباشرة من الأسواق العالمية لنقدم لك أفضل الأسعار التنافسية.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">خدمة سريعة</h3>
            <p className="text-gray-600">
              خدمة سريعة وفعالة مع دعم شامل قبل وبعد الشراء.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">فريقنا</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wide Selection Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تشكيلة واسعة</h2>
          <p className="text-gray-600 text-center">
            نقدم مجموعة شاملة من أجهزة اللابتوب من مختلف العلامات التجارية والمصنعين. مرونتنا في التوريد تتيح لنا تلبية أي متطلبات خاصة، لنضمن لك الحصول على ما تحتاجه بأفضل سعر ممكن.
          </p>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">زر متجرنا</h2>
          <div className="text-center space-y-4">
            <p className="text-gray-600 font-semibold">مول الحمد</p>
            <p className="text-gray-600">دمياط الجديدة</p>
            <Link href="/contact">
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                تواصل معنا
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;