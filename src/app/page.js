import CategorySection from "@/components/Home/CategorySection";
import SaleSection from "@/components/Home/SaleSection";
import NewsletterSection from "@/components/Home/NewsletterSection";
import NewProductSection from "@/components/Home/NewProductSection";
import BestSeller from "@/components/Home/BestSeller";
import Header from "@/components/Header/index";
import Footer from "@/components/footer/Footer";
import { connectDB } from "@/lib/mongoose";
import Sale from "@/models/sale";

async function getSale() {
  try {
    await connectDB();
    const sale = await Sale.findOne().sort({ createdAt: -1 }).lean();
    if (!sale) return null;
    return JSON.parse(JSON.stringify(sale));
  } catch (error) {
    console.error("Error fetching sale:", error);
    return null;
  }
}

export default async function Home() {
  const sale = await getSale();

  return (
    <>
      <Header />
      <CategorySection />
      <NewProductSection />
      {sale && sale.isActive && (
        <SaleSection
          title={sale.title}
          discount={sale.discount}
          startDate={sale.startDate}
          endDate={sale.endDate}
          leftImage={sale.leftImage}
          rightImage={sale.rightImage}
          buttonText={sale.buttonText}
          buttonLink={sale.buttonLink}
        />
      )}
      <BestSeller />
      <NewsletterSection />
      <Footer />
    </>
  )
}