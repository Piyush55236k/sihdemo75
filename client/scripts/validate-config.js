// Client Environment Configuration Validation Script  
import { config } from '../src/config/env.js';

console.log('🔍 Client Environment Configuration Validation\n');

// Test configuration loading
try {
  console.log('✅ Client configuration loaded successfully');
  console.log(`🔗 API Base URL: ${config.api.baseUrl}`);
  console.log(`⏱️  API Timeout: ${config.api.timeout / 1000}s`);
  console.log('');
  
  // Test required configurations
  const requiredConfigs = [
    { name: 'API Base URL', value: config.api.baseUrl },
    { name: 'Supabase URL', value: config.supabase.url },
    { name: 'Supabase Anon Key', value: config.supabase.anonKey }
  ];
  
  console.log('🔐 Required Configurations:');
  requiredConfigs.forEach(({ name, value }) => {
    const status = value ? '✅' : '❌';
    const displayValue = name.includes('Key') ? (value ? '***hidden***' : 'Missing') : value;
    console.log(`  ${status} ${name}: ${displayValue}`);
  });
  
  console.log('');
  
  // Test optional configurations
  console.log('⚙️  Feature Configurations:');
  console.log(`  🎤 Speech Recognition: ${config.speech.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  🌍 Translation: ${config.translation.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  🗣️  Default Language: ✅ ${config.language.default}`);
  console.log(`  🌐 Supported Languages: ✅ ${config.language.supported.join(', ')}`);
  console.log(`  🐛 Debug Mode: ${config.app.debug ? '✅ Enabled' : '❌ Disabled'}`);
  
  console.log('');
  
  // Configuration warnings
  const warnings = [];
  
  if (config.api.baseUrl.includes('localhost')) {
    warnings.push('API pointing to localhost - ensure server is running locally');
  }
  
  if (!config.supabase.url) {
    warnings.push('Supabase URL not configured - authentication will fail');
  }
  
  if (!config.supabase.anonKey) {
    warnings.push('Supabase anonymous key not configured - authentication will fail');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Configuration Warnings:');
    warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    console.log('');
  }
  
  console.log('🎉 Client configuration validation completed!');
  console.log('💡 Check CHATBOT_SETUP.md for usage guide');
  
} catch (error) {
  console.error('❌ Client configuration validation failed:');
  console.error(error.message);
  console.log('\n📚 Please check your client/.env file and refer to client/.env.example');
}
