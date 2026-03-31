#!/usr/bin/env node
/**
 * Stripe Product & Price Setup Script
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe.mjs
 *
 * This script creates all Zyph Labs products and prices in your Stripe account
 * (acct_1T6KPC15c0oH8KMO, test/sandbox mode) and prints the env var block
 * to paste into your .env.local and Vercel project settings.
 */

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key || key === 'sk_test_placeholder') {
  console.error('ERROR: Set STRIPE_SECRET_KEY env var before running this script.')
  console.error('  Example: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe.mjs')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

async function createOneTimePrice(productName, amountCents, metadata = {}) {
  const product = await stripe.products.create({
    name: productName,
    metadata,
  })
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency: 'usd',
    metadata,
  })
  return { product, price }
}

async function createRecurringPrice(productName, amountCents, metadata = {}) {
  const product = await stripe.products.create({
    name: productName,
    metadata,
  })
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata,
  })
  return { product, price }
}

async function main() {
  console.log('Creating Stripe products and prices...\n')

  const results = {}

  // ── Contractors ────────────────────────────────────────────────────────────
  results.STRIPE_PRICE_CONTRACTOR_BASIC = (await createOneTimePrice(
    'Contractors — Starter Lead Page (Basic)', 14900, { niche: 'contractors', tier: 'basic' }
  )).price.id

  results.STRIPE_PRICE_CONTRACTOR_STANDARD = (await createOneTimePrice(
    'Contractors — Local Service Website (Standard)', 39900, { niche: 'contractors', tier: 'standard' }
  )).price.id

  results.STRIPE_PRICE_CONTRACTOR_PREMIUM = (await createOneTimePrice(
    'Contractors — Lead Engine + Trust Build (Premium)', 79900, { niche: 'contractors', tier: 'premium' }
  )).price.id

  // ── E-Commerce ─────────────────────────────────────────────────────────────
  results.STRIPE_PRICE_ECOMMERCE_BASIC = (await createOneTimePrice(
    'E-Commerce — Starter Store Setup (Basic)', 19900, { niche: 'ecommerce', tier: 'basic' }
  )).price.id

  results.STRIPE_PRICE_ECOMMERCE_STANDARD = (await createOneTimePrice(
    'E-Commerce — Branded Store Launch (Standard)', 54900, { niche: 'ecommerce', tier: 'standard' }
  )).price.id

  results.STRIPE_PRICE_ECOMMERCE_PREMIUM = (await createOneTimePrice(
    'E-Commerce — CRO Rebuild + Launch Support (Premium)', 119900, { niche: 'ecommerce', tier: 'premium' }
  )).price.id

  // ── Real Estate ────────────────────────────────────────────────────────────
  results.STRIPE_PRICE_REALESTATE_BASIC = (await createOneTimePrice(
    'Real Estate — Agent Lead Page (Basic)', 17900, { niche: 'real-estate', tier: 'basic' }
  )).price.id

  results.STRIPE_PRICE_REALESTATE_STANDARD = (await createOneTimePrice(
    'Real Estate — Realtor Website (Standard)', 49900, { niche: 'real-estate', tier: 'standard' }
  )).price.id

  results.STRIPE_PRICE_REALESTATE_PREMIUM = (await createOneTimePrice(
    'Real Estate — IDX/MLS Integration Build (Premium)', 109900, { niche: 'real-estate', tier: 'premium' }
  )).price.id

  // ── Law Firms ──────────────────────────────────────────────────────────────
  results.STRIPE_PRICE_LAWFIRM_BASIC = (await createOneTimePrice(
    'Law Firms — Credibility Landing Page (Basic)', 19900, { niche: 'law-firms', tier: 'basic' }
  )).price.id

  results.STRIPE_PRICE_LAWFIRM_STANDARD = (await createOneTimePrice(
    'Law Firms — Firm Website (Standard)', 59900, { niche: 'law-firms', tier: 'standard' }
  )).price.id

  results.STRIPE_PRICE_LAWFIRM_PREMIUM = (await createOneTimePrice(
    'Law Firms — Multi-Practice + Intake Optimization (Premium)', 129900, { niche: 'law-firms', tier: 'premium' }
  )).price.id

  // ── Hosting Plans (recurring monthly) ─────────────────────────────────────
  results.STRIPE_PRICE_HOSTING_STARTER = (await createRecurringPrice(
    'Zyph Labs Hosting — Starter ($29/mo)', 2900, { plan: 'hosting', tier: 'starter' }
  )).price.id

  results.STRIPE_PRICE_HOSTING_PROFESSIONAL = (await createRecurringPrice(
    'Zyph Labs Hosting — Professional ($49/mo)', 4900, { plan: 'hosting', tier: 'professional' }
  )).price.id

  results.STRIPE_PRICE_HOSTING_BUSINESS = (await createRecurringPrice(
    'Zyph Labs Hosting — Business ($79/mo)', 7900, { plan: 'hosting', tier: 'business' }
  )).price.id

  // ── Output ─────────────────────────────────────────────────────────────────
  console.log('\n✅ All products and prices created successfully!\n')
  console.log('='.repeat(60))
  console.log('Copy the following into your .env.local and Vercel env vars:')
  console.log('='.repeat(60))
  console.log()
  for (const [key, value] of Object.entries(results)) {
    console.log(`${key}=${value}`)
  }
  console.log()
  console.log('='.repeat(60))
  console.log('Also update in Vercel dashboard → Project Settings → Environment Variables')
}

main().catch((err) => {
  console.error('Stripe setup failed:', err.message)
  process.exit(1)
})
