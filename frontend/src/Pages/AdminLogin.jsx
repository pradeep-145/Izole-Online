import React from 'react'

const AdminLogin = () => {
  return (
    <div>
        <div>
            <h1>Admin Login</h1>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" placeholder="Enter email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                </div>
                <button type="submit">Login</button>    
            </form>
        </div>
    </div>
  )
}

export default AdminLogin