import React from 'react'
import { useState } from 'react'

const Navbar = () => {
    const [login, setLogin] = useState(localStorage.getItem("token")||null)
    return (
        <div>
            <div>
                <div className="navbar shadow-sm justify-between bg-neutral p-4 fixed top-0 w-full z-10">
                    <div className="flex flex-row ml-5 items-center justify-center gap-5">
                        <a href='/' className="text-2xl font-extrabold font-serif">IZOLE</a>
                        <div>
                            <a href="#home" className="btn btn-ghost">Home</a>
                            <a href="#products" className="btn btn-ghost">Products</a>
                            <a href="#about" className="btn btn-ghost">About</a>
                            <a href="#contact" className="btn btn-ghost">Contact</a>
                        </div>
                    </div>
                    <div className="flex">
                        <div className='flex flex-row gap-5'>
                        {/* <input type="text" placeholder="Search" className="input input-bordered w-32 md:w-auto" /> */}
                        <div className="dropdown dropdown-end">
                           {login==="customer" && <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                                    <span className="badge badge-sm indicator-item">8</span>
                                </div>
                            </div>}
                            <div
                                tabIndex={0}
                                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                                <div className="card-body">
                                    <span className="text-lg font-bold">8 Items</span>
                                    <span className="text-info">Subtotal: $999</span>
                                    <div className="card-actions">
                                        <button className="btn btn-primary btn-block">View cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                                    </div>
                        
                       {login && <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a onClick={()=>
                                {
                                    localStorage.removeItem("token")
                                    setLogin(null)
                                }
                                }>Logout</a></li>
                            </ul>
                        </div>}

                        {login===null && <a href='/customerLogin' className="btn btn-primary rounded-2xl">Login/SignUp</a>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar