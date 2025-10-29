import React, { useState, useEffect } from 'react';
import { useAppContext } from "../Context/AppContext";
import Loading from '../Pages/Loading';
import toast from 'react-hot-toast';

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null); // track which plan is being purchased
  const { token, axios } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plans', {
        headers: { Authorization: token }
      });
      if (data.success) setPlans(data.plans);
      else toast.error(data.message || 'Failed to fetch plans.');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  const gradient = 'from-purple-500 to-indigo-700';

  const handlePurchase = async (planId) => {
    if (!token) return toast.error("Login first to buy credits.");
    setProcessingPlanId(planId); // only this plan shows processing
    try {
      const { data } = await axios.post(
        '/api/credit/purchase',
        { planId },
        { headers: { Authorization: token } }
      );
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to start purchase.");
        setProcessingPlanId(null);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      setProcessingPlanId(null);
    }
  };

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800 dark:text-white">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div key={plan._id} className="max-w-80 overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="ml-2 text-lg">/ {plan.credits} Credits</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{plan.description}</p>
                <ul className="mb-6 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="mt-0.5 mr-2 h-5 w-5 text-purple-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(plan._id)}
                disabled={processingPlanId === plan._id}
                className={`w-full rounded-lg bg-gradient-to-r ${gradient} px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 mt-auto ${processingPlanId === plan._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processingPlanId === plan._id ? "Processing..." : plan._id === 'premium' ? "Get Premium" : "Buy Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
