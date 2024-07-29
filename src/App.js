// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [output, setOutput] = useState(0);

  useEffect(
    function () {
      const controller = new AbortController();

      async function convertAmount() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${currency1}&to=${currency2}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            if (currency1 === currency2)
              throw new Error("Currencies must be different!");

            throw new Error("Enter amount > 0 or < 0");
          }
          const data = await res.json();

          setOutput(data["rates"][`${currency2}`]);
          setIsLoading(false);
          setError("");
          console.log(output);
        } catch (err) {
          setError(err.message);
          console.log(err.message);
        }
      }
      convertAmount();
      return function () {
        controller.abort();
      };
    },
    [currency1, currency2, amount, error, output]
  );

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) =>
          setAmount((amount) => (amount = Number(e.target.value)))
        }
        disabled={isLoading}
      />
      <select onChange={(e) => setCurrency1((curr) => (curr = e.target.value))}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
      </select>
      <select onChange={(e) => setCurrency2((curr) => (curr = e.target.value))}>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
      </select>
      <p>{error ? error : output.toFixed(3)}</p>
    </div>
  );
}
