"use server";

import { cookies } from 'next/headers';

export async function signUp(formData: { name: string; email: string; password: string }) {
  try {
    const response = await fetch('https://relearnai.onrender.com/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || '註冊失敗' };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: '系統錯誤，請稍後再試' };
  }
}

export async function signIn(formData: { email: string; password: string }) {
  try {
    const response = await fetch('https://relearnai.onrender.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || '登入失敗' };
    }

    const data = await response.json();
    
    // Parse and print JWT token data
    if (data.token) {
      // Parse JWT token (without using external libraries)
      const tokenParts = data.token.split('.');
      let userId = null;
      
      if (tokenParts.length === 3) {
        try {
          // Decode the payload (second part of the token)
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          console.log('Decoded token data:', payload);
          
          // Extract user ID from token payload
          if (payload.userId) {
            userId = payload.userId;
            console.log('User ID from token:', userId);
          }
        } catch (error) {
          console.error('Error parsing JWT token:', error);
        }
      }
      
      // Store the token in a secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // Set an appropriate expiration time
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      // Store user ID from token in a separate cookie
      if (userId) {
        console.log('Storing user ID in cookie:', userId);
        cookieStore.set({
          name: 'userId',
          value: userId,
          httpOnly: false, // Allow JavaScript access if needed
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: '系統錯誤，請稍後再試' };
  }
}

export async function signOut() {
  // Clear the token and userId cookies using the proper Next.js cookies API
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('userId');
  console.log('Deleted token and userId cookies');
  return { success: true };
}
