import React from "react";
import { Link } from "react-router-dom";
import { TranslatedText } from "../hooks/useAutoTranslation.jsx";
import {
  Play,
  Target,
  TrendingUp,
  Users,
  Star,
  Award,
  ArrowRight,
  Leaf,
  Sprout,
  TreePine,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Play,
      title: <TranslatedText>Learning Through Play</TranslatedText>,
      description: (
        <TranslatedText>
          Master sustainable farming practices through interactive challenges
          and fun activities.
        </TranslatedText>
      ),
    },
    {
      icon: Target,
      title: <TranslatedText>Personalized Quests</TranslatedText>,
      description: (
        <TranslatedText>
          Get custom farming missions tailored to your crops and local
          conditions.
        </TranslatedText>
      ),
    },
    {
      icon: TrendingUp,
      title: <TranslatedText>Progress Tracker</TranslatedText>,
      description: (
        <TranslatedText>
          Monitor your sustainability journey with detailed analytics and
          achievements.
        </TranslatedText>
      ),
    },
    {
      icon: Users,
      title: <TranslatedText>Community</TranslatedText>,
      description: (
        <TranslatedText>
          Connect with fellow farmers, share tips, and celebrate successes
          together.
        </TranslatedText>
      ),
    },
  ];

  const testimonials = [
    {
      name: "Ramesh Patel",
      location: "Gujarat",
      text: (
        <TranslatedText>
          This platform transformed how I approach farming. I've increased my
          yield by 40% while reducing water usage!
        </TranslatedText>
      ),
      rating: 5,
    },
    {
      name: "Sita Devi",
      location: "Uttar Pradesh",
      text: (
        <TranslatedText>
          The quests make learning fun. My children now help me with farming
          tasks!
        </TranslatedText>
      ),
      rating: 5,
    },
    {
      name: "Amit Kumar",
      location: "Punjab",
      text: (
        <TranslatedText>
          Finally, a platform that understands Indian farming challenges. Highly
          recommended!
        </TranslatedText>
      ),
      rating: 5,
    },
  ];

  const partners = ["ICAR", "NABARD", "KVK", "FPO Network", "AgriTech India"];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-green-300 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <TranslatedText>Grow Smarter. Get Rewarded.</TranslatedText>
              </h1>
              <p className="text-xl mb-8 text-green-100 max-w-lg">
                <TranslatedText>
                  Transform your farming practices through gamified learning.
                  Complete quests, earn rewards, and build a sustainable future
                  for Indian agriculture.
                </TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <TranslatedText>Start Your First Quest</TranslatedText>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/community"
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <TranslatedText>Join the Movement</TranslatedText>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="w-32 h-32 bg-white/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  <TranslatedText>Smart Farming Revolution</TranslatedText>
                </h3>
                <p className="text-green-100">
                  <TranslatedText>Why Choose Our Platform?</TranslatedText>
                </p>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            <TranslatedText>Why Choose Our Platform?</TranslatedText>
          </h2>
          <p className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto">
            <TranslatedText>
              Experience the future of sustainable farming with rewards and
              gamification
            </TranslatedText>
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            <TranslatedText>Trusted by Farmers Across India</TranslatedText>
          </h2>
          <p className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto">
            <TranslatedText>
              Join thousands of farmers who have already transformed their
              practices
            </TranslatedText>
          </p>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{testimonial.text}</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Partners */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6">
              <TranslatedText>Trusted by Leading Organizations</TranslatedText>
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200"
                >
                  <span className="text-gray-600 font-medium">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            <TranslatedText>Ready to Transform Your Farming?</TranslatedText>
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            <TranslatedText>
              Join thousands of farmers who are already earning rewards while
              building a sustainable future for Indian agriculture.
            </TranslatedText>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <TranslatedText>Start Your Journey</TranslatedText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/community"
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <TranslatedText>Learn More</TranslatedText>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
