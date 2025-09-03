#!/bin/bash

# Deployment script for Vercel
# This script helps ensure all environment variables are properly set

echo "🚀 Preparing for Vercel deployment..."

# Check if required environment variables are set locally
echo "📋 Checking local environment variables..."

required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY" 
    "VITE_OPENAI_API_KEY"
    "VITE_WEATHER_API_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    else
        echo "✅ $var is set"
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    echo ""
    echo "Please add these to your .env file and Vercel dashboard"
    exit 1
fi

echo ""
echo "🌍 Don't forget to add these environment variables to Vercel:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add each variable from your .env file"
echo "5. Set environment to: Production, Preview, and Development"
echo ""
echo "Required variables for Vercel:"
for var in "${required_vars[@]}"; do
    echo "   $var = ${!var}"
done

echo ""
echo "✅ Local environment check complete!"
echo "🚀 Ready for deployment!"
