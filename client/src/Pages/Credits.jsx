import React, { useState, useEffect } from 'react';
import { dummyPlans } from '../assets/assets';
import Loading from '../Pages/Loading';

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans); // uses your dummyPlans
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  const gradient = 'from-purple-500 to-indigo-700';

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800 dark:text-white">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="max-w-80 overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            {/* Top Gradient Section */}
            <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
              <h3 className="text-xl font-bold">{plan.name ?? 'Plan'}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">${plan.price ?? 0}</span>
                <span className="ml-2 text-lg">/ {plan.credits ?? 0} Credits</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white dark:bg-gray-900 p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  {plan._id === 'premium'
                    ? 'Everything you need for advanced projects and teams.'
                    : plan._id === 'pro'
                    ? 'Perfect for power users and professionals.'
                    : 'Great for individuals starting out.'}
                </p>

                <ul className="mb-6 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mt-0.5 mr-2 h-5 w-5 text-purple-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full rounded-lg bg-gradient-to-r ${gradient} px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 mt-auto`}
              >
                {plan._id === 'premium' ? 'Get Premium' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
