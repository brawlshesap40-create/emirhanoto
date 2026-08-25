import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/section-heading";

const FAQS = [
  {
    question: "Araçlarınız ekspertizden geçiyor mu?",
    answer:
      "Evet, stoğumuzdaki tüm araçlar satışa çıkmadan önce detaylı ekspertizden geçirilir. Motor, şanzıman, kaporta, boya durumu ve varsa hasar/değişen parça bilgileri her araç ilanında şeffaf şekilde paylaşılır.",
  },
  {
    question: "Test sürüşü nasıl talep edebilirim?",
    answer:
      "İlgilendiğiniz aracın detay sayfasındaki \"Test Sürüşü Talebi Oluştur\" butonuna tıklayarak bilgilerinizi ve tercih ettiğiniz tarihi bize iletebilirsiniz. Ekibimiz en kısa sürede sizi arayarak randevunuzu onaylar.",
  },
  {
    question: "Aracımı satmak istiyorum, nasıl değerleme alabilirim?",
    answer:
      "Ana sayfadaki \"Aracımı Değerle\" formunu doldurmanız yeterli. Marka, model, yıl ve kilometre bilgilerinizi aldıktan sonra ekibimiz sizi arayarak ön değerleme sürecini başlatır.",
  },
  {
    question: "Araç alımında takas veya kredi imkanı var mı?",
    answer:
      "Takas ve kredi seçenekleri araca ve güncel kampanyalara göre değişebilir. Detaylı bilgi için WhatsApp veya telefon üzerinden ekibimizle iletişime geçebilirsiniz.",
  },
  {
    question: "Şubenize nasıl ulaşabilirim, çalışma saatleriniz nedir?",
    answer: `${siteConfig.address} adresinde, hafta içi ve cumartesi ${siteConfig.workingHours} saatleri arasında hizmet veriyoruz. Yol tarifi için haritalar bağlantısını kullanabilirsiniz.`,
  },
  {
    question: "36 yıllık tecrübeniz bize ne sağlıyor?",
    answer:
      "1988'den bu yana İstanbul'da özellikle çift kabin pick-up ve ticari araç segmentinde uzmanlaştık. Bu tecrübe, güvenilir ekspertiz, doğru fiyatlandırma ve şeffaf alım-satım süreci olarak size yansıyor.",
  },
];

export function FaqSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading
        align="center"
        eyebrow="04 — Merak Ettikleriniz"
        title="Sıkça Sorulan Sorular"
        description="Aklınıza takılan bir şey mi var? Aşağıda bulamazsanız bize doğrudan ulaşabilirsiniz."
      />

      <Accordion className="mt-8 overflow-hidden rounded-xl border border-border bg-card px-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]">
        {FAQS.map((faq, index) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="gap-4">
              <span className="flex items-baseline gap-3">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="pl-8 text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
