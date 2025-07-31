import Footer from '@/components/layout/Footer';

export default function ThankYouPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="rounded-lg shadow-md p-6 bg-neutral-100">
        <h1 className="text-2xl font-bold mb-4">Thank you!</h1>
        <p className="mb-2">Your order has been received and is now on its way.</p>
        <p className="mb-2">We've sent you an email with the complete order details.</p>
        <p className="mt-4">We appreciate your trust in RentRoll. Enjoy your experience!</p>
      </div>
    <Footer/>
    </main>
  );
}