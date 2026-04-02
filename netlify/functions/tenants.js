const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const client = require('./mongodb');
const { sendCredentials } = require('./email');

exports.handler = async (event, context) => {
  const db = await client.getDb();
  const token = event.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (event.httpMethod === 'GET') {
      const tenants = await db.collection('users').find({ role: 'tenant' }).toArray();
      return { statusCode: 200, body: JSON.stringify(tenants) };
    }
    
    if (event.httpMethod === 'POST') {
      const { name, email, phoneNumber, roomNumber, apartment, rentAmount } = JSON.parse(event.body);
      
      // Check capacity
      const apartmentSettings = await db.collection('settings').findOne({ key: 'apartment' });
      const tenantCount = await db.collection('users').countDocuments({ role: 'tenant' });
      
      if (tenantCount >= apartmentSettings.capacity) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Apartment at full capacity' }) };
      }
      
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newTenant = {
        name,
        email,
        phoneNumber,
        roomNumber,
        apartment,
        rentAmount,
        balance: 0,
        role: 'tenant',
        password: hashedPassword,
        profilePicture: '/default-avatar.png',
        createdAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(newTenant);
      await sendCredentials(email, name, password);
      
      return { statusCode: 201, body: JSON.stringify({ ...newTenant, _id: result.insertedId }) };
    }
    
    if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      await db.collection('users').deleteOne({ _id: new ObjectId(id), role: 'tenant' });
      return { statusCode: 200, body: JSON.stringify({ message: 'Deleted successfully' }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
