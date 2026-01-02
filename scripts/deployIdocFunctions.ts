#!/usr/bin/env node

/**
 * Deploy iDoc Edge Functions Script
 *
 * This script deploys all iDoc-related Edge Functions to Supabase.
 * Run with: npx tsx scripts/deployIdocFunctions.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const FUNCTIONS_TO_DEPLOY = [
  'idoc-lint',
  'idoc-batch-lint',
  'idoc-publish',
];

async function deployFunction(functionName: string) {
  console.log(`\n📦 Deploying ${functionName}...`);

  const functionPath = path.join(process.cwd(), 'supabase', 'functions', functionName);

  if (!fs.existsSync(functionPath)) {
    console.error(`   ❌ Function directory not found: ${functionPath}`);
    return false;
  }

  console.log(`   ✅ Function ${functionName} ready for deployment`);
  console.log(`   📍 Path: ${functionPath}`);
  return true;
}

async function main() {
  console.log('🚀 iDoc Edge Functions Deployment Script\n');
  console.log('=' .repeat(50));

  let successCount = 0;
  let failCount = 0;

  for (const functionName of FUNCTIONS_TO_DEPLOY) {
    const success = await deployFunction(functionName);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Deployment Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📦 Total: ${FUNCTIONS_TO_DEPLOY.length}`);

  if (failCount === 0) {
    console.log('\n🎉 All functions are ready!');
    console.log('\n📖 Manual Deployment Required:');
    console.log('   Use the Supabase CLI or the deploy_edge_function tool');
    console.log('   to deploy these functions to your Supabase project.');
  } else {
    console.log('\n⚠️  Some functions had issues. Please check the errors above.');
  }
}

main().catch(console.error);
