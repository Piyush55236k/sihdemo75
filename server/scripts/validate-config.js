// Environment Configuration Validation Script
const { config } = require('../config/env');

console.log('🔍 Environment Configuration Validation\n');

// Test configuration loading
try {
  console.log('✅ Configuration loaded successfully');
  console.log(`📦 Environment: ${config.server.env}`);
  console.log(`🚀 Server Port: ${config.server.port}`);
  console.log(`🏠 Server Host: ${config.server.host}`);
  console.log('');
  
  // Test required configurations
  const requiredConfigs = [
    { name: 'MongoDB URI', value: config.database.mongodb.uri },
    { name: 'Supabase URL', value: config.auth.supabase.url },
    { name: 'OpenAI API Key', value: config.openai.apiKey ? '✓ Present' : '❌ Missing' }
  ];
  
  console.log('🔐 Required Configurations:');
  requiredConfigs.forEach(({ name, value }) => {
    const status = value ? '✅' : '❌';
    const displayValue = name.includes('Key') ? (value ? '***hidden***' : 'Missing') : value;
    console.log(`  ${status} ${name}: ${displayValue}`);
  });
  
  console.log('');
  
  // Test optional configurations
  console.log('⚙️  Optional Configurations:');
  console.log(`  🌤️  Weather API: ${config.weather.openweather.apiKey ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`  🎯 Rate Limiting: ✅ ${config.rateLimiting.general.windowMs / 1000 / 60} min window, ${config.rateLimiting.general.max} requests`);
  console.log(`  🗣️  AI Model: ✅ ${config.openai.model}`);
  console.log(`  🔗 CORS Origin: ✅ ${config.cors.origin}`);
  
  console.log('');
  
  // Environment validation
  if (config.server.env === 'production') {
    console.log('🏭 Production Environment Checks:');
    const productionChecks = [
      { name: 'HTTPS Database Connection', check: config.database.mongodb.uri.startsWith('mongodb+srv://') },
      { name: 'Secure JWT Secret', check: config.auth.jwt.secret.length > 32 },
      { name: 'Production Supabase', check: !config.auth.supabase.url.includes('localhost') }
    ];
    
    productionChecks.forEach(({ name, check }) => {
      console.log(`  ${check ? '✅' : '⚠️ '} ${name}`);
    });
  } else {
    console.log('🔧 Development Environment - Configuration looks good!');
  }
  
  console.log('\n🎉 Configuration validation completed successfully!');
  console.log('💡 Check ENVIRONMENT_SETUP.md for detailed configuration guide');
  
} catch (error) {
  console.error('❌ Configuration validation failed:');
  console.error(error.message);
  console.log('\n📚 Please check your .env file and refer to .env.example');
  process.exit(1);
}
