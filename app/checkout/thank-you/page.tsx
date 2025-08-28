import Footer from '@/components/layout/Footer';

export default function ThankYouPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="rounded-lg shadow-md p-6 bg-neutral-100">
        <h1 className="text-2xl font-bold mb-4">Grazie!</h1>
        <p className="mb-2">Il tuo ordine e' stato correttamente ricevuto.</p>
        <p className="mb-2">Ti abbiamo inviato una mail con il riassunto dell' ordine. (Controlla la posta indesiderata!)</p>
        <p className="mt-10"> Grazie per la fiducia, ti auguriamo una piacevole esperienza!</p>
      </div>
    <Footer/>
    </main>
  );
}