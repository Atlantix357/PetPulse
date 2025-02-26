import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Activity, Clock, Weight, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future of <span className="text-secondary">Pet Health</span> Management
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Track your pet's health, schedule feedings and medications, and monitor their well-being with our futuristic pet health management platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Futuristic Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform offers cutting-edge tools to help you manage your pet's health with ease and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary bg-opacity-20 rounded-full mb-4">
                <PawPrint size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pet Profiles</h3>
              <p className="text-gray-400">
                Create detailed profiles for all your pets with photos, birth dates, and weight tracking.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-secondary bg-opacity-20 rounded-full mb-4">
                <Weight size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Weight Tracking</h3>
              <p className="text-gray-400">
                Monitor your pet's weight over time with interactive charts and visualizations.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary bg-opacity-20 rounded-full mb-4">
                <Clock size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Feeding Schedules</h3>
              <p className="text-gray-400">
                Set up and track feeding schedules to ensure your pet is fed properly and on time.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-secondary bg-opacity-20 rounded-full mb-4">
                <Activity size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Health Monitoring</h3>
              <p className="text-gray-400">
                Track medications, treatments, and health metrics to ensure your pet stays healthy.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary bg-opacity-20 rounded-full mb-4">
                <Shield size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Data</h3>
              <p className="text-gray-400">
                Your pet's health data is securely stored and accessible only to you.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="inline-flex items-center justify-center p-3 bg-secondary bg-opacity-20 rounded-full mb-4">
                <PawPrint size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multiple Pets</h3>
              <p className="text-gray-400">
                Manage multiple pets in one place with individual profiles and health records.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-dark-light rounded-2xl p-8 md:p-12 shadow-lg border border-dark-lighter">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Pet Care?</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Join thousands of pet owners who are already using our platform to keep their pets healthy and happy.
              </p>
              <Link to="/signup">
                <Button size="lg">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
