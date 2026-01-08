import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import API from "../api/axios";

const CheckoutForm = ({ clientSecret, paymentId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            // Optional: Redirect or show success message
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-4">
            <div className="border p-3 rounded bg-white">
                <CardElement id="card-element" options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                                color: "#aab7c4",
                            },
                        },
                        invalid: {
                            color: "#9e2146",
                        },
                    },
                }} />
            </div>

            <button
                disabled={processing || succeeded || !stripe}
                id="submit"
                className="mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                <span id="button-text">
                    {processing ? "Processing..." : "Pay Now"}
                </span>
            </button>

            {error && (
                <div className="text-red-500 mt-2 text-sm" role="alert">
                    {error}
                </div>
            )}

            {succeeded && (
                <p className="text-green-600 mt-2 text-sm font-semibold">
                    Payment Succeeded! You can now view your job details.
                </p>
            )}
        </form>
    );
};

export default CheckoutForm;
