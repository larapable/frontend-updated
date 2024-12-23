'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface PaymentDetails {
  paymentId?: string;
  PayerID?: string;
}

function SuccessfulPage() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const PayerID = searchParams.get('PayerID');
    
    if (paymentId && PayerID) {
      setPaymentDetails({ paymentId, PayerID });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 text-[rgb(59,59,59)] mt-[5rem]">
      <div className="items-center max-w-[100rem] mx-auto bg-white rounded-xl border shadow-md overflow-hidden md:max-w-[150rem] h-[35rem] flex flex-col md:mt-10">
        <div className="flex flex-row flex-1">
          <div className="md:flex flex-1">
            <div className="p-8">
              <div className="tracking-wide text-4xl font-semibold mb-5 ml-8 mt-10">Payment Successful</div>
              <h1 className="block mt-1 text-lg leading-tight font-medium ml-8">
                Your payment was successful! Thank you for your purchase. Please note your Payment ID and Payer ID below for your records. If you need any assistance, feel free to contact our support team.
              </h1>
              {/* Progress Indicator */}
              <div className="w-full max-w-3xl mx-auto px-4 py-6 mr-[8rem] mt-5 mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="mt-2 text-sm font-semibold text-gray-500">Checkout</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#c7360a] mt-[-1rem] ml-[-1rem]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center ml-[-1rem]">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="mt-2 text-sm font-semibold text-gray-500">Pay</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#c7360a] mt-[-1rem] ml-[-0.5rem]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center ml-[-1rem]">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="mt-2 text-sm font-semibold text-gray-500">Done</span>
                  </div>
                </div>
              </div>

              {paymentDetails && (
                <div className="mt-2 text-gray-500 ml-8 mb-10">
                  <p className="block mt-1 text-lg leading-tight font-medium mb-2">Payment ID: 
                    <span className='text-[rgb(59,59,59)] font-bold ml-2'>{paymentDetails.paymentId}</span>
                  </p>
                  <p className="block mt-1 text-lg leading-tight font-medium">Payer ID: 
                    <span className='text-[rgb(59,59,59)] font-bold ml-2'>{paymentDetails.PayerID}</span>
                  </p>
                </div>
              )}

              <div className="mt-4 ml-8 flex flex-row gap-10">
                <a href="/">
                  <div className="text-white rounded-[0.6rem] py-2 px-3 h-[3rem] w-[12rem] items-center justify-center text-center font-semibold text-lg"
                    style={{
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                    }}>
                      Home
                  </div>
                </a>
                <a href="/signup">
                  <div className="text-[#AB3510] border border-[#AB3510] rounded-[0.6rem] py-2 px-3 h-[3rem] w-[12rem] items-center justify-center text-center font-semibold text-lg hover:text-white hover:bg-[#AB3510]"
                    >
                      Sign up
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="md:flex">
            <img
              src="/success.png"
              alt=""
              className="h-[35rem] justify-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageExport() {

  return (
  <Suspense>
    <SuccessfulPage />
  </Suspense>)
}