import Link from 'next/link';

export default function SEOContent() {
  return (
    <section className="w-full bg-brand-paper py-16 md:py-24 border-t border-brand-gray-border/60">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-16 md:gap-y-14 lg:gap-y-16 transition-all duration-700">
          
          {/* Section 1: Smartphones */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Mobile Hat - The Best Smartphone Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Mobile Hat stands as the premier destination for tech enthusiasts and casual users alike, offering an unparalleled selection of smartphones from the world's leading manufacturers. Whether you are looking for the latest flagship innovation or a budget-friendly reliable device, our collection is curated to suit every preference and financial plan. We feature an expansive range of top global brands including 
              <Link href="/brand/apple" className="text-brand-navy font-semibold hover:underline mx-1">Apple iPhone</Link>, 
              <Link href="/brand/samsung" className="text-brand-navy font-semibold hover:underline mx-1">Samsung</Link>, 
              <Link href="/brand/google" className="text-brand-navy font-semibold hover:underline mx-1">Google Pixel</Link>, 
              <Link href="/brand/xiaomi" className="text-brand-navy font-semibold hover:underline mx-1">Xiaomi</Link>, Oppo, Vivo, 
              <Link href="/brand/oneplus" className="text-brand-navy font-semibold hover:underline mx-1">OnePlus</Link>, Motorola, Realme, Honor, Nokia, Sony, Huawei, Asus, Infinix, Tecno, ZTE, Poco, iQOO, and the innovative Nothing Phone series. At Mobile Hat, we don't just sell phones; we provide a complete technology experience. With each purchase, you enjoy the absolute assurance of 100% authenticity, competitive market-beating prices, and official warranties that provide long-term peace of mind, firmly establishing Mobile Hat as the best smartphone retailer in the Bangladesh market.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Our commitment to quality ensures that every device on our shelves undergoes rigorous checks. From the high-performance cameras of the latest Samsung Galaxy S series to the unmatched ecosystem integration of the iPhone 15 and 16 Pro Max, we bring global technology directly to your hands. We also specialize in regional variants and international versions, ensuring our customers have access to models that might not be easily available elsewhere in Bangladesh.
            </p>
          </div>

          {/* Section 2: Tablets */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Tablet and iPad Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              In the modern era, tablets have become indispensable tools for productivity, education, and creative expression. Mobile Hat's tablet collection is designed to cater to this diverse range of needs, featuring popular models like the legendary 
              <Link href="/category/ipad" className="text-brand-navy font-semibold hover:underline mx-1">Apple iPad Pro, iPad Air, and iPad Mini</Link>. For those who prefer the flexibility of Android, we offer the latest 
              <Link href="/brand/samsung" className="text-brand-navy font-semibold hover:underline mx-1">Samsung Galaxy Tab series</Link>, 
              <Link href="/brand/xiaomi" className="text-brand-navy font-semibold hover:underline mx-1">Xiaomi Tablets</Link>, and high-performance options from Honor, Huawei, and Google. Whether you are a professional artist requiring a responsive canvas, a student attending online classes, or a casual user seeking an immersive media experience, our inventory has the perfect match.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              In addition to major brands, we also carry specialized devices like Amazon Fire Tablets for readers and kids, ensuring every family member finds what they need. At Mobile Hat, we prioritize the complete user experience, offering official accessories such as Apple Pencils, Magic Keyboards, and protective cases. With competitive pricing and expert guidance from our staff, choosing the right tablet has never been easier in Bangladesh.
            </p>
          </div>

          {/* Section 3: Laptops */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Laptop Selling Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Looking for a powerful machine to handle your daily tasks or intense gaming sessions? Mobile Hat's laptop selection is curated to provide the best performance-to-value ratio. From the sleek and powerful 
              <Link href="/category/macbook" className="text-brand-navy font-semibold hover:underline mx-1">Apple MacBook Pro and Air</Link> to dedicated 
              <Link href="/category/gaming-laptops" className="text-brand-navy font-semibold hover:underline mx-1">Gaming Laptops</Link> and Ultra-portable Ultrabooks, we have it all. We carry premium global brands like HP, Dell, Lenovo, and ASUS, offering models tailored for business professionals, software developers, and students. Our laptops are available with flexible EMI options, official warranties, and dedicated after-sales support to ensure your investment is protected.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              We understand that choosing a laptop can be overwhelming, which is why our experts are always ready to help you compare specifications, battery life, and display quality. Whether you need a 2-in-1 convertible for presentations or a workstation-grade Mac Studio for high-end video editing, Mobile Hat is your trusted partner. Our commitment to authentic products ensures that you receive genuine software and a reliable hardware warranty with every purchase.
            </p>
          </div>

          {/* Section 4: MacBook and iMac */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best MacBook and iMac Selling Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              As a premier retailer of Apple products in Bangladesh, Mobile Hat takes pride in offering the complete range of macOS devices. Our inventory features the latest MacBook Air with M2 and M3 chips, the powerhouse MacBook Pro series, and the stunning 24-inch iMac with 4.5K Retina display. We also cater to stationary power users with the Mac Studio and Mac Mini, providing the ultimate desktop experience for professionals in design, music production, and engineering.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Every Apple device sold at Mobile Hat comes with the assurance of international warranty support and access to our in-house technical experts. We understand the unique requirements of the Apple ecosystem, and our team is trained to help you synchronize your iPhone, iPad, and Mac seamlessly. Competitive pricing combined with periodic promotional offers makes Mobile Hat the go-to shop for anyone looking to enter or upgrade their experience in the Apple ecosystem.
            </p>
          </div>

          {/* Section 5: Apple Gadget Shop */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Apple Gadget Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              The Apple experience goes far beyond just phones and computers. At Mobile Hat, we provide the full spectrum of Apple gadgets to complete your lifestyle. From the latest 
              <Link href="/category/apple-watch" className="text-brand-navy font-semibold hover:underline mx-1">Apple Watch Ultra and Series 9</Link> for health tracking to the industry-leading 
              <Link href="/category/airpods" className="text-brand-navy font-semibold hover:underline mx-1">AirPods Pro and Max</Link> for immersive audio, we stock everything you need. We also offer essential Apple accessories like MagSafe chargers, high-speed cables, and various ecosystem enhancements that make your devices work smarter.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              One of our unique offerings is the <strong>Mobile Hat Care+</strong> program, which provides an extra layer of protection for your valuable gadgets. This includes direct replacement options for many Apple devices within a year, ensuring that your tech remains operational without long wait times. Combined with our competitive pricing and top-tier customer service, Mobile Hat is established as the most reliable gadget shop for premium tech enthusiasts in Bangladesh.
            </p>
          </div>

          {/* Section 6: Online Mobile Shop */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Online Mobile Shop in Bangladesh</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Mobile Hat has revolutionized the way people shop for technology in Bangladesh. Our online platform provides a seamless, user-friendly experience that allows you to browse, compare, and purchase the latest gadgets from the comfort of your home. We offer comprehensive product descriptions, high-quality images, and customer reviews to help you make an informed decision. With secure payment gateways supporting all major credit cards, mobile banking, and cash-on-delivery, transparency and security are at the core of our operations.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Our fast and reliable delivery network ensures that your favorite tech reaches you in record time, whether you are in Dhaka or any other corner of Bangladesh. We take extreme care in packaging your orders to prevent any transit damage. Beyond the sale, our dedicated support team is available via chat, phone, and social media to assist with any queries or issues. Discover why thousands of customers choose Mobile Hat as their trusted online mobile and gadget shop every single day.
            </p>
          </div>

          {/* Section 7: Why Choose Mobile Hat */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Why Mobile Hat is Your Ultimate Tech Partner</h2>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Choosing the right tech retailer is crucial for ensuring you get authentic products and reliable service. At Mobile Hat, we differentiate ourselves through our unwavering commitment to "Authenticity, Value, and Service." We source directly from authorized distributors and verified global partners, ensuring that every product you buy is 100% genuine. Our pricing strategy is designed to be the most competitive in Bangladesh, often accompanied by exclusive gift bundles, bank discounts, and zero-interest EMI facilities.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-medium">
              Moreover, our after-sales support is unmatched. We provide a dedicated service center for warranty claims and technical assistance, ensuring that you are never left alone if your device develops a fault. Whether it's a software glitch or a hardware inquiry, the Mobile Hat team is here to support you throughout the lifespan of your device. Experience the future of tech retail with Mobile Hat—where your satisfaction is our highest priority.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
