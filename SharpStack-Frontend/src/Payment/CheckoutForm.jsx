import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/payment-complete",
      },
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <button type="submit">
        Pay Now
      </button>
    </form>
  );
}