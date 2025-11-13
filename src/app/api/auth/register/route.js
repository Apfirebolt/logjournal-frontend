// api/auth/register

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    // Forward the registration data to the FastAPI backend
    const fastApiRegisterUrl = process.env.BACKEND_BASE_URL + '/api/auth/register';

    const response = await axios.post(
      fastApiRegisterUrl,
      { username, email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // Return the response from the FastAPI backend
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}