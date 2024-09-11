import React from 'react';

export default function Payment() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  return (
    <div className="justify-center items-center text-[rgb(43,43,43)]">

    {/* <div style={{
      backgroundImage: 'url("landingbg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}> */}
      <div className="font-bold text-center lg:text-[4.1rem] lg:mb-10 md:mt-5 md:text-[4rem] md:mb-10">
          Payment
      </div>
      <div className="h-[43rem] w-[50rem] ml-[38rem] border border-[#ee552a] rounded-2xl bg-white">
      <div className="h-[5rem] rounded-2xl bg-[#fff6d1] border-b-2 border-[#ee552a] pl-5 pr-4 pt-4">
        <div className='flex flex-row gap-[5rem]'>
          <span className='items-center font-medium'>To continue, you must have a PayPal account. If you do not have one, please <br/>
          <a 
            href="https://www.paypal.com/signup" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            create a PayPal account 
          </a> 
          <span className="ml-1">
            before proceeding with the payment process.
          </span>
          </span>
          <div className='flex flex-row ml-[-4rem]'>
          <img
            src="/paypal1.png"
            alt=""
            className="h-[3rem] "
          />
          <img
            src="/paypal2.png"
            alt=""
            className=" h-[3rem]"
          />
          </div>
        </div>
      </div>
      <form method="post" action={`${backendUrl}/payment/create`}>
        <div className="justify-center items-center ml-5 mr-5 mt-5">
          <div className='flex flex-row gap-5'>
            <div className='flex flex-col w-[25rem]'>
              <label htmlFor="firstname">First Name</label>
              <input 
                type="text" 
                id="firstname" 
                name="firstname" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                required/>
            </div>
            <div className='flex flex-col w-[25rem]'>
              <label htmlFor="lastname">Last Name</label>
              <input 
                type="text" 
                id="lastname" 
                name="lastname" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                required/>
            </div>
          </div>
            <div className='flex flex-col'>
              <label htmlFor="departmentname">Department Name</label>
              <input 
                type="text" 
                id="departmentname" 
                name="departmentname" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                required/>
            </div>
            <div className='flex flex-row gap-5'>
            <div className='flex flex-col w-[15rem]'>
              <label htmlFor="method">Payment Method</label>
              <input 
                type="text" 
                id="method" 
                name="method" 
                defaultValue="PayPal" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                readOnly />
            </div>
            <div className='flex flex-col w-[15rem]'>
              <label htmlFor="amount">Amount</label>
              <input 
                type="number" 
                id="amount" 
                name="amount" 
                defaultValue="10" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                readOnly />
            </div>
            <div className='flex flex-col w-[15rem]'>
              <label htmlFor="currency">Currency</label>
              <input 
                type="text" 
                id="currency" 
                name="currency" 
                defaultValue="USD" 
                className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg flex items-center mb-6 py-4 px-2"
                readOnly />
            </div>
          </div>
            <div className='flex flex-col'>
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                className="border-[0.1rem] h-[8rem] border-solid border-black border-opacity-60 rounded-lg break-words mb-6 py-4 px-2 "
                required />
            </div>
            <div className='flex justify-center items-center'>
              <button 
                className="mb-10 text-white rounded-[0.6rem] py-2 px-3 h-[4rem] w-[15rem] justify-center text-center font-semibold text-lg"
                style={{
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                }}
                type="submit">
                  Pay with Paypal
              </button>
            </div>
        </div>
      </form>
      </div>
    </div>
  );
}
