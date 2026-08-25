import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFloatingButton } from "@/components/site/whatsapp-floating-button";
import { CompareBar } from "@/components/vehicles/compare-bar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
      <CompareBar />
    </>
  );
}
