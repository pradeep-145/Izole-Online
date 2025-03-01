import React from 'react'

const CustomerSignUp = () => {
  return (
    <div>
        <div>
            <h1>Customer Sign Up</h1>
            <form>
                <div>
                    <label>Name</label>
                    <input type="text" placeholder="Enter name" />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" placeholder="Enter email" />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="number" placeholder="Enter phone number" />  
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                </div>
                <button type="submit">Sign Up</button>   
                <p>Already have an account? <a href="/customerLogin">Login</a></p> 
            </form>
        </div>
    </div>
  )
}

export default CustomerSignUp