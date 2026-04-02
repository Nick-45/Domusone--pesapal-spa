const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require('./mongodb');

exports.handler = async (event, context) => {
  const db = await client.getDb();
  const path = event.path.replace('/.netlify/functions/auth/', '');
  
  if (event.httpMethod === 'POST' && path === 'login') {
    const { email, password } = JSON.parse(event.body);
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      })
    };
  }
  
  return { statusCode: 404, body: 'Not found' };
};
