import Link from "next/link";
import type { Metadata } from "next";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/site/page-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: `${siteConfig.name} kişisel verilerin korunması kanunu (KVKK) aydınlatma metni.`,
};

const SECTIONS = [
  {
    title: "1. Veri Sorumlusu",
    body: `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, ${siteConfig.name} ("Şirket") tarafından, veri sorumlusu sıfatıyla, aşağıda açıklanan kapsamda kişisel verileriniz işlenmektedir. Şirket adresi: ${siteConfig.address}. İletişim: ${siteConfig.phoneDisplay} / ${siteConfig.email}.`,
  },
  {
    title: "2. İşlenen Kişisel Veriler",
    body: "Sitemiz üzerindeki formlar (iletişim, araç değerleme, test sürüşü, kredi ön başvurusu, kiralama talebi, fiyat alarmı, stok bildirimi ve ilan bildirimi) aracılığıyla ad-soyad, telefon numarası, e-posta adresi ve talebinize ilişkin araç/kiralama bilgileri (marka, model, yıl, kilometre, tercih edilen tarih aralığı vb.) ile formda paylaştığınız serbest metin notları işlenmektedir.",
  },
  {
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    body: "Toplanan kişisel verileriniz; talebinizin değerlendirilmesi ve tarafınıza geri dönüş yapılması, araç alım-satım ve kiralama süreçlerinin yürütülmesi, test sürüşü ve kredi ön görüşmelerinin planlanması, fiyat/stok bildirimlerinin gönderilmesi ile müşteri ilişkilerinin yönetilmesi amaçlarıyla işlenmektedir.",
  },
  {
    title: "4. Toplama Yöntemi ve Hukuki Sebep",
    body: "Kişisel verileriniz, sitemizdeki ilgili formu doldurmanız suretiyle elektronik ortamda toplanmaktadır. Verileriniz, KVKK'nın 5. maddesinde yer alan \"bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olma\" ve \"veri sorumlusunun meşru menfaati\" hukuki sebeplerine dayanılarak işlenmektedir.",
  },
  {
    title: "5. Kişisel Verilerin Aktarılması",
    body: "Kişisel verileriniz, talebinizin niteliğine göre yalnızca hizmetin yürütülmesi için gerekli olduğu ölçüde ve mevzuatın izin verdiği hallerde (ör. kredi ön görüşmesi için ilgili finans kuruluşları) yurt içindeki iş ortaklarımızla paylaşılabilir. Verileriniz yurt dışına aktarılmamaktadır; barınma altyapımız yurt içinde konumlandırılmıştır.",
  },
  {
    title: "6. Saklama Süresi",
    body: "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri saklı kalmak kaydıyla saklanır; bu sürelerin sonunda silinir, yok edilir veya anonim hale getirilir.",
  },
  {
    title: "7. Haklarınız (KVKK m. 11)",
    body: "KVKK'nın 11. maddesi uyarınca; kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde/dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini/yok edilmesini isteme, düzeltme-silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
  },
  {
    title: "8. Başvuru Yöntemi",
    body: `Yukarıda sayılan haklarınıza ilişkin taleplerinizi ${siteConfig.email} adresine e-posta göndererek veya ${siteConfig.address} adresine yazılı olarak başvurarak iletebilirsiniz.`,
  },
];

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              <Home className="h-3.5 w-3.5" />
              Ana Sayfa
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>KVKK Aydınlatma Metni</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        eyebrow="Kişisel Verilerin Korunması"
        title="KVKK Aydınlatma Metni"
        description="Sitemizdeki formları doldururken paylaştığınız kişisel verilerin nasıl işlendiğini bu sayfada bulabilirsiniz."
      />

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
