import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4">Welcome to Rainfall Prediction System</h1>
          <p className="lead">Predict rainfall, analyze crop yield, and study satellite imagery for better agricultural planning</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Rainfall Prediction</h5>
              <p className="card-text">Get accurate rainfall predictions for your location to plan agricultural activities effectively.</p>
              <Link href="/rainfall" className="btn btn-primary">Predict Rainfall</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Crop Yield Prediction</h5>
              <p className="card-text">Predict crop yields based on historical data and current conditions for better harvest planning.</p>
              <Link href="/crop-yield" className="btn btn-primary">Predict Yield</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Satellite Analysis</h5>
              <p className="card-text">Analyze satellite imagery to monitor agricultural land and environmental conditions.</p>
              <Link href="/satellite" className="btn btn-primary">Analyze Imagery</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
