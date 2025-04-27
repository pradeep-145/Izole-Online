import React from 'react'

const ShippingStatus = () => {
    return (
        <div>
            <section class="py-24 relative bg-gray-100">
                <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div class="w-full flex-col justify-start items-start gap-12 inline-flex">
                        <div class="w-full justify-between items-center flex sm:flex-row flex-col gap-3">
                            <div class="w-full flex-col justify-center sm:items-start items-center gap-1 inline-flex">
                                <h2 class="text-gray-500 text-2xl font-semibold font-manrope leading-9">Order
                                    <span class="text-indigo-600">#125103</span>
                                </h2>
                                <span class="text-gray-500 text-base font-medium leading-relaxed">May 21, 2023</span>
                            </div>
                            <button
                                class="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M14.25 9V5.25C14.25 3.83579 14.25 3.12868 13.8107 2.68934C13.3713 2.25 12.6642 2.25 11.25 2.25H6.75C5.33579 2.25 4.62868 2.25 4.18934 2.68934C3.75 3.12868 3.75 3.83579 3.75 5.25V9M6.75 5.25H11.25M6.75 7.5H11.25M12 12.2143C12 12.0151 12 11.9155 12.0188 11.8331C12.0829 11.5522 12.3022 11.3329 12.5831 11.2688C12.6655 11.25 12.7651 11.25 12.9643 11.25H14.25C14.9571 11.25 15.3107 11.25 15.5303 11.4697C15.75 11.6893 15.75 12.0429 15.75 12.75V14.25C15.75 14.9571 15.75 15.3107 15.5303 15.5303C15.3107 15.75 14.9571 15.75 14.25 15.75H3.75C3.04289 15.75 2.68934 15.75 2.46967 15.5303C2.25 15.3107 2.25 14.9571 2.25 14.25V12.75C2.25 12.0429 2.25 11.6893 2.46967 11.4697C2.68934 11.25 3.04289 11.25 3.75 11.25H5.03571C5.23491 11.25 5.3345 11.25 5.41689 11.2688C5.69776 11.3329 5.91709 11.5522 5.9812 11.8331C6 11.9155 6 12.0151 6 12.2143C6 12.4135 6 12.5131 6.0188 12.5955C6.08291 12.8763 6.30224 13.0957 6.58311 13.1598C6.6655 13.1786 6.76509 13.1786 6.96429 13.1786H11.0357C11.2349 13.1786 11.3345 13.1786 11.4169 13.1598C11.6978 13.0957 11.9171 12.8763 11.9812 12.5955C12 12.5131 12 12.4135 12 12.2143Z"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                <span class="px-1.5 text-white text-sm font-medium leading-6 whitespace-nowrap">Print
                                    Invoice</span>
                            </button>
                        </div>
                        <div class="w-full justify-end items-start gap-8 inline-flex">
                            <div class="w-full flex-col justify-start items-start gap-8 inline-flex">
                                <div class="w-full p-8 bg-white rounded-xl flex-col justify-start items-start gap-5 flex">
                                    <h2
                                        class="w-full text-gray-900 text-2xl font-semibold font-manrope leading-9 pb-5 border-b border-gray-200">
                                        Order Tracking</h2>
                                    <div class="w-full flex-col justify-center items-center">
                                        <ol
                                            class="flex md:flex-row flex-col md:items-start items-center justify-between w-full md:gap-1 gap-4">
                                            <li
                                                class="group flex relative justify-start after:content-[''] lg:after:w-11 md:after:w-5 after:w-5 after:h-0.5 md:after:border after:border-dashed md:after:bg-gray-500 after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-36">
                                                <div
                                                    class="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                                                    <div class="justify-center items-center gap-1.5 inline-flex">
                                                        <h5
                                                            class="text-center text-gray-900 text-lg font-medium leading-normal">
                                                            Order Placed</h5>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                            viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                                                fill="#047857" />
                                                            <path
                                                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                                                fill="#047857" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                                                fill="#047857" />
                                                        </svg>
                                                    </div>
                                                    <h6 class="text-center text-gray-500 text-base font-normal leading-relaxed">
                                                        20 May, 2024</h6>
                                                </div>
                                            </li>
                                            <li
                                                class="group flex relative justify-start after:content-[''] lg:after:w-11 md:after:w-5 after:w-5 after:h-0.5 md:after:border after:border-dashed md:after:bg-gray-500 after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-32">
                                                <div
                                                    class="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                                                    <div class="justify-center items-center gap-1.5 inline-flex">
                                                        <h5
                                                            class="text-center text-gray-900 text-lg font-medium leading-normal">
                                                            Picked</h5>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                            viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                                                fill="#047857" />
                                                            <path
                                                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                                                fill="#047857" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                                                fill="#047857" />
                                                        </svg>
                                                    </div>
                                                    <h6 class="text-center text-gray-500 text-base font-normal leading-relaxed">
                                                        22 May, 2024</h6>
                                                </div>
                                            </li>
                                            <li
                                                class="group flex relative justify-start after:content-[''] lg:after:w-11 md:after:w-5 after:w-5 after:h-0.5 md:after:border after:border-dashed md:after:bg-gray-500 after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-32">
                                                <div
                                                    class="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                                                    <div class="justify-center items-center gap-1.5 inline-flex">
                                                        <h5
                                                            class="text-center text-gray-900 text-lg font-medium leading-normal">
                                                            Packed</h5>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                            viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                                                fill="#047857" />
                                                            <path
                                                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                                                fill="#047857" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                                                fill="#047857" />
                                                        </svg>
                                                    </div>
                                                    <h6 class="text-center text-gray-500 text-base font-normal leading-relaxed">
                                                        23 May, 2024</h6>
                                                </div>
                                            </li>
                                            <li
                                                class="group flex relative justify-start after:content-[''] lg:after:w-11 md:after:w-5 after:w-5 after:h-0.5 md:after:border after:border-dashed md:after:bg-gray-500 after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-[155px]">
                                                <div
                                                    class="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                                                    <div class="justify-center items-center gap-1.5 inline-flex">
                                                        <h5
                                                            class="text-center text-gray-900 text-lg font-medium leading-normal whitespace-nowrap">
                                                            Order Shipped</h5>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                            viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                                                fill="#047857" />
                                                            <path
                                                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                                                fill="#047857" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                                                fill="#047857" />
                                                        </svg>
                                                    </div>
                                                    <h6 class="text-center text-gray-500 text-base font-normal leading-relaxed">
                                                        28 May, 2024</h6>
                                                </div>
                                            </li>
                                            <li class="group flex relative justify-start">
                                                <div class="w-full z-10 flex flex-col items-center justify-start gap-1">
                                                    <div class="justify-center items-center gap-1.5 inline-flex">
                                                        <h5
                                                            class="text-center text-gray-500 text-lg font-medium leading-normal">
                                                            Order Delivered</h5>
                                                    </div>
                                                    <h6 class="text-center text-gray-500 text-base font-normal leading-relaxed">
                                                        2 Jun, 2024</h6>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <div class="w-full p-8 bg-white rounded-xl flex-col justify-start items-start gap-5 flex">
                                    <h2
                                        class="w-full text-gray-900 text-2xl font-semibold font-manrope leading-9 pb-5 border-b border-gray-200">
                                        Order Items</h2>
                                    <div
                                        class="w-full flex-col justify-start items-start gap-5 flex pb-5 border-b border-gray-200">
                                        <div
                                            class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                            <div
                                                class="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                                <img class="rounded-md object-cover" src="https://pagedone.io/asset/uploads/1718189222.png"
                                                    alt="Pure Cotton T-Shirt image" />
                                                <div
                                                    class="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                    <h4 class="text-gray-900 text-xl font-medium leading-8">Pure Cotton Regular
                                                        Fit T-Shirt</h4>
                                                    <div
                                                        class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                        <h6
                                                            class="text-gray-500 text-base font-normal leading-relaxed whitespace-nowrap">
                                                            Size: M</h6>
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Color:
                                                            White</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                                <h4 class="text-gray-500 text-xl font-semibold leading-8">$40 x 2</h4>
                                                <h4 class="text-gray-900 text-xl font-semibold leading-8">$80</h4>
                                            </div>
                                        </div>
                                        <div
                                            class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                            <div
                                                class="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                                <img class="rounded-md object-cover" src="https://pagedone.io/asset/uploads/1718189265.png"
                                                    alt="Men Stretchable Jeans image" />
                                                <div
                                                    class="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                    <h4 class="text-gray-900 text-xl font-medium leading-8">Men Skinny Fit
                                                        Stretchable Jeans</h4>
                                                    <div
                                                        class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Size: 32
                                                        </h6>
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Color:
                                                            Blue</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                                <h4 class="text-gray-500 text-xl font-semibold leading-8">$52 x 1</h4>
                                                <h4 class="text-gray-900 text-xl font-semibold leading-8">$52</h4>
                                            </div>
                                        </div>
                                        <div
                                            class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                            <div
                                                class="md:col-span-8 col-span-12 justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                                <img class="rounded-md object-cover" src="https://pagedone.io/asset/uploads/1718189276.png"
                                                    alt="Men Cotton Casual Shirt image" />
                                                <div
                                                    class="flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                    <h4 class="text-gray-900 text-xl font-medium leading-8">Men Checked Cotton
                                                        Casual Shirt</h4>
                                                    <div
                                                        class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Size: M
                                                        </h6>
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Color:
                                                            Dark Blue</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                                <h4 class="text-gray-500 text-xl font-semibold leading-8">$22 x 1</h4>
                                                <h4 class="text-gray-900 text-xl font-semibold leading-8">$22</h4>
                                            </div>
                                        </div>
                                        <div
                                            class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1 pb-2.5">
                                            <div
                                                class="md:col-span-8 col-span-12 justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                                <img class="rounded-md object-cover" src="https://pagedone.io/asset/uploads/1718189288.png"
                                                    alt="Men Colourblocked PU Sneakers image" />
                                                <div
                                                    class="flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                    <h4 class="text-gray-900 text-xl font-medium leading-8">Men Colourblocked PU
                                                        Sneakers</h4>
                                                    <div
                                                        class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Size: 38
                                                        </h6>
                                                        <h6 class="text-gray-500 text-base font-normal leading-relaxed">Color:
                                                            Green & Gray</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                                <h4 class="text-gray-500 text-xl font-semibold leading-8">$56 x 1</h4>
                                                <h4 class="text-gray-900 text-xl font-semibold leading-8">$56</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-full flex-col justify-start items-start gap-5 flex">
                                        <div class="w-full pb-1.5 flex-col justify-start items-start gap-4 flex">
                                            <div class="w-full justify-between items-start gap-6 inline-flex">
                                                <h6 class="text-gray-500 text-base font-normal leading-relaxed">Subtotal</h6>
                                                <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                    $210.00</h6>
                                            </div>
                                            <div class="w-full justify-between items-start gap-6 inline-flex">
                                                <h6 class="text-gray-500 text-base font-normal leading-relaxed">Shipping Charge
                                                </h6>
                                                <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                    $10.00</h6>
                                            </div>
                                            <div class="w-full justify-between items-start gap-6 inline-flex">
                                                <h6 class="text-gray-500 text-base font-normal leading-relaxed">Tax Fee</h6>
                                                <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                    $22.00</h6>
                                            </div>
                                        </div>
                                        <div class="w-full justify-between items-start gap-6 inline-flex">
                                            <h5 class="text-gray-900 text-lg font-semibold leading-relaxed">Total</h5>
                                            <h5 class="text-right text-gray-900 text-lg font-semibold leading-relaxed">$242.00
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default ShippingStatus