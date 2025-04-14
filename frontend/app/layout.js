import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rainfall Prediction System',
  description: 'Predict rainfall, crop yield and analyze satellite imagery',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">Rainfall Prediction</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/rainfall">Rainfall Prediction</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/crop-yield">Crop Yield</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/satellite">Satellite Analysis</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mt-4">
          {children}
        </main>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
