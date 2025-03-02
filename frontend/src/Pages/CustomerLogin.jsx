import React from 'react'

const CustomerLogin = () => {
  return (
    <div>
        <div>
            <h1>Customer Login</h1>
            <form>
                <div>
                    <label>Phone Number</label>
                    <input type="number" placeholder="Enter phone number" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                </div>
                <button type="submit">Login</button>   
                <p>Don't have an account? <a href="/customerSignup">Sign Up</a></p> 
            </form>
        </div>
    </div>
  )
}

export default CustomerLogin