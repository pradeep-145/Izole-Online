const axios = require('axios')
require('dotenv').config()
const getAuthToken=async () => {
    try{
        const token = await axios.post(`https://apiv2.shiprocket.in/v1/external/auth/login`, {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(token.data && token.data.token){
            return token.data.token;
        }
        else{
            console.error("Error getting auth token:", token.data);
            return null;
        }
    }catch(error){
        console.error("Error getting auth token:", error);
        return null;
    }
}

const makeAuthenticatedRequest = async (token,endpoint, method, data) => {
        try{
            const config={
                url: `https://apiv2.shiprocket.in/v1/external/${endpoint}`,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                
            }

            if(data){
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        }catch(error){
            console.error("Error making authenticated request:", error);
            return null;
        }
}


module.exports={
    createOrder:(token, orderData)=>{
        return makeAuthenticatedRequest(token, 'orders/create/adhoc', 'POST', orderData);
    },
    cancelOrder:(token, orderId)=>{
        return makeAuthenticatedRequest(token, `orders/cancel/${orderId}`, 'POST');
    },
    generateAWB:(token, shipmentId)=>{
        return makeAuthenticatedRequest(token, `courier/assign/awb`, 'POST', {shipment_id: shipmentId});
    },
    getAWB:(token, awb)=>{
        return makeAuthenticatedRequest(token, `courier/generate/awb/${awb}`, 'GET');
    },
    getOrderDetails:(token, orderId)=>{
        return makeAuthenticatedRequest(token, `orders/show/${orderId}`, 'GET');
    },
    getShipments:(token, orderId)=>{
        return makeAuthenticatedRequest(token, `shipments/${orderId}`, 'GET');
    },
    getTracking:(token, awb)=>{
        return makeAuthenticatedRequest(token, `courier/track/awb/${awb}`, 'GET');
    },
    getCouriers:(token)=>{
        return makeAuthenticatedRequest(token, `courier`, 'GET');
    },
    getAuthToken:()=>{
        return getAuthToken();
    }

}