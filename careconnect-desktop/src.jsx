import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  return (
    <main className="login-page">
      <section className="login-container">
        <div className="brand">
          <h1>CareConnect</h1>
          <p>Secure access to your healthcare</p>
        </div>

        <div className="login-card">
          <h2>Welcome</h2>
          <p className="subtitle">Sign in to your account</p>

          <form>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    </main>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
