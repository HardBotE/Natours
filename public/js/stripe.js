import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';



const bookTour = async (tourId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`,
      {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    if (!response.ok) {
      console.log(err);
    }

    const session = await response.json();
    console.log(session);

    // Stripe redirect
    const stripe = await loadStripe('pk_test_51QdbWaBAl1gRN4jqH5JGUn4YPsdxOkmgH9fXOJeb8nWFMhYNE8xpwXra475Zjah0RafBtYZ2mYfHNbnaCQVvbN7800QFvIu6UB');
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (err) {
    console.error('Error:', err);
  }
};

module.exports=bookTour