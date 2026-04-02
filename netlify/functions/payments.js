const axios = require('axios');
const crypto = require('crypto');
const client = require('./mongodb');

exports.handler = async (event, context) => {
  const db = await client.getDb();
  
  if (event.httpMethod === 'POST' && event.path.includes('/initialize')) {
    const { amount, tenantId, email, phoneNumber } = JSON.parse(event.body);
    
    const paymentData = {
      id: crypto.randomBytes(16).toString('hex'),
      amount,
      tenantId,
      email,
      phoneNumber,
      status: 'pending',
      createdAt: new Date()
    };
    
    await db.collection('payments').insertOne(paymentData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentId: paymentData.id,
        iframeUrl: process.env.REACT_APP_PESAPAL_IFRAME_URL
      })
    };
  }
  
  if (event.httpMethod === 'POST' && event.path.includes('/callback')) {
    const { paymentId, status, transactionId } = JSON.parse(event.body);
    
    if (status === 'completed') {
      const payment = await db.collection('payments').findOne({ id: paymentId });
      
      // Update tenant balance
      await db.collection('users').updateOne(
        { _id: new ObjectId(payment.tenantId) },
        { $inc: { balance: -payment.amount } }
      );
      
      // Record transaction
      await db.collection('transactions').insertOne({
        tenantId: payment.tenantId,
        amount: payment.amount,
        type: 'payment',
        transactionId,
        status: 'completed',
        date: new Date()
      });
      
      await db.collection('payments').updateOne(
        { id: paymentId },
        { $set: { status: 'completed', transactionId } }
      );
    }
    
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }
  
  return { statusCode: 404, body: 'Not found' };
};
