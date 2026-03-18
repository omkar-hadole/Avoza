import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // If we decide to use cookies in the future, we can set them here.
  // Currently, we will return the token to the frontend.
  return token;
};

export default generateToken;
