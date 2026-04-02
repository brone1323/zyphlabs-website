export interface Testimonial {
  name: string
  title: string
  text: string
}

export interface PortfolioItem {
  id: string
  demoSlug: string
  businessName: string
  tagline: string
  description: string
  features: string[]
  heroGradient: string
  accentColor: string
  services: string[]
  ctaLabel: string
  niche: 'contractors' | 'ecommerce' | 'real-estate' | 'law-firms'
  // Demo page content
  phone: string
  location: string
  heroHeadline: string
  heroSubtext: string
  testimonials: Testimonial[]
}

export const portfolioItems: PortfolioItem[] = [
  // Contractors
  {
    id: 'vanguard-roofing',
    demoSlug: 'vanguard-roofing',
    businessName: 'Vanguard Roofing Co.',
    tagline: 'Denver\'s most trusted roofers · Licensed & insured',
    description: 'Full-site rebuild for a local roofing company. Lead capture form, photo gallery, Google reviews integration, and fast-loading service area pages.',
    features: ['Lead Form', 'Service Area Pages', 'Photo Gallery', 'Google Reviews'],
    heroGradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #5c2800 100%)',
    accentColor: '#f97316',
    services: ['Roof Replacement', 'Repairs', 'Storm Damage', 'New Construction', 'Gutters', 'Inspections'],
    ctaLabel: 'Get a Free Estimate',
    niche: 'contractors',
    phone: '(555) 843-7200',
    location: 'Denver, CO',
    heroHeadline: "Denver's Most Trusted Roofing Contractor",
    heroSubtext: 'Licensed, insured, and backed by 25 years of roofing excellence. We handle everything from emergency repairs to full replacements — with a transferable warranty on every job.',
    testimonials: [
      { name: 'Marcus T.', title: 'Homeowner, Denver', text: 'Vanguard replaced our entire roof after the hailstorm last spring. Professional crew, clean work site, and finished in one day. Could not be happier.' },
      { name: 'Sarah K.', title: 'Property Manager', text: 'We manage 12 units and Vanguard is our go-to roofer. Responsive, priced fairly, and the work always holds up through the winters.' },
      { name: 'James & Linda F.', title: 'Homeowners, Littleton', text: "Got three quotes and Vanguard was the most transparent. No upsells, no surprises on the invoice. The new roof looks fantastic." },
    ],
  },

  // E-Commerce
  {
    id: 'velvet-petal',
    demoSlug: 'velvet-petal',
    businessName: 'Velvet Petal Skincare',
    tagline: 'Clean beauty. Real results.',
    description: 'Shopify store for a premium skincare brand. Custom theme, product bundles, email capture popup, and a high-converting product page layout.',
    features: ['Custom Theme', 'Product Bundles', 'Email Capture', 'Upsell Flow'],
    heroGradient: 'linear-gradient(135deg, #1a0a1a 0%, #2d1040 50%, #3d1566 100%)',
    accentColor: '#c084fc',
    services: ['Cleansers', 'Serums', 'Moisturizers', 'Eye Care', 'Bundles', 'Gift Sets'],
    ctaLabel: 'Shop the Collection',
    niche: 'ecommerce',
    phone: '',
    location: '',
    heroHeadline: 'Clean Beauty, Formulated for Real Skin.',
    heroSubtext: 'Botanically sourced, dermatologist-tested, free from parabens and synthetic fragrance. Skincare that works with your skin, not against it.',
    testimonials: [
      { name: 'Olivia H.', title: 'Verified Customer', text: "The Hydrating Serum changed my skin completely. I've tried dozens of serums and nothing else has come close. I'm a customer for life." },
      { name: 'Maya R.', title: 'Verified Customer', text: 'Love that everything is clean and actually effective. The bundle deals are great value and the packaging is gorgeous — makes a perfect gift.' },
      { name: 'Chloe T.', title: 'Verified Customer', text: 'Finally a brand that delivers on its promises. My hyperpigmentation has faded noticeably in just 6 weeks of using the brightening routine.' },
    ],
  },

  // Real Estate
  {
    id: 'meridian-luxury-realty',
    demoSlug: 'meridian-luxury-realty',
    businessName: 'Meridian Luxury Realty',
    tagline: 'Exceptional homes. Exceptional service.',
    description: 'High-end realtor site with IDX-style listing showcase, neighborhood guides, and a consultation booking flow that captures serious buyer leads.',
    features: ['Listing Showcase', 'Neighborhood Guides', 'Lead Forms', 'Market Reports'],
    heroGradient: 'linear-gradient(135deg, #0a0a00 0%, #1a1400 50%, #2a2200 100%)',
    accentColor: '#d4af37',
    services: ['Buyer Representation', 'Seller Representation', 'Luxury Homes', 'Relocation Services', 'Investment Properties', 'New Development'],
    ctaLabel: 'View Current Listings',
    niche: 'real-estate',
    phone: '(555) 847-2900',
    location: 'Scottsdale, AZ',
    heroHeadline: 'Extraordinary Homes for Extraordinary Lives.',
    heroSubtext: "Scottsdale's premier luxury real estate team. Whether you're buying, selling, or investing, we bring white-glove service and deep market expertise to every transaction.",
    testimonials: [
      { name: 'Jonathan & Claire V.', title: 'Luxury Buyers', text: "Meridian found us our dream home in Paradise Valley. They had access to off-market listings we couldn't find anywhere else. Seamless from start to close." },
      { name: 'Diane M.', title: 'Home Seller', text: 'Listed with Meridian and received three offers above asking within the first week. Their marketing is in a completely different league.' },
      { name: 'Robert S.', title: 'Investment Buyer', text: "I've done four transactions with Meridian now. Their knowledge of the luxury market is unmatched and they always protect my interests." },
    ],
  },

  // Law Firms
  {
    id: 'ashford-drake',
    demoSlug: 'ashford-drake',
    businessName: 'Ashford & Drake LLP',
    tagline: 'Personal injury attorneys fighting for you.',
    description: 'High-converting personal injury firm site with case value calculator, free consultation CTA above the fold, and Google review testimonials.',
    features: ['Case Calculator', 'Free Consult CTA', 'Review Feed', 'Practice Areas'],
    heroGradient: 'linear-gradient(135deg, #0d0000 0%, #1f0000 50%, #300000 100%)',
    accentColor: '#dc2626',
    services: ['Car & Truck Accidents', 'Slip & Fall', 'Workplace Injuries', 'Medical Malpractice', 'Wrongful Death', 'Product Liability'],
    ctaLabel: 'Get Your Free Case Review',
    niche: 'law-firms',
    phone: '(555) 556-4400',
    location: 'Atlanta, GA',
    heroHeadline: 'Injured? We Fight Until You Win.',
    heroSubtext: "Atlanta's most aggressive personal injury firm. No fees unless we win. Free case review within 24 hours. When insurance companies play hardball, Ashford & Drake plays harder.",
    testimonials: [
      { name: 'Terrence W.', title: 'Car Accident Client', text: 'After my accident, the insurance company offered me a lowball settlement. Ashford & Drake took the case and got me 7x what was offered. They are absolutely the best.' },
      { name: 'Maria G.', title: 'Slip & Fall Client', text: 'I was seriously injured at a grocery store and didn\'t know what to do. They handled everything, kept me informed, and got a settlement that covered all my medical bills and then some.' },
      { name: 'Kevin N.', title: 'Workplace Injury Client', text: "Don't try to navigate a serious injury claim alone. I tried and got nowhere. Ashford & Drake stepped in and the difference was immediate. Highly recommend." },
    ],
  },
]

export const portfolioByNiche = {
  contractors: portfolioItems.filter((i) => i.niche === 'contractors'),
  ecommerce: portfolioItems.filter((i) => i.niche === 'ecommerce'),
  'real-estate': portfolioItems.filter((i) => i.niche === 'real-estate'),
  'law-firms': portfolioItems.filter((i) => i.niche === 'law-firms'),
}

export const nichePortfolioMeta = {
  contractors: {
    label: 'Contractors & Trades',
    tagline: 'Lead-generating sites for roofers, HVAC, plumbers, electricians, and more.',
    color: '#f97316',
    serviceHref: '/services/contractors',
  },
  ecommerce: {
    label: 'E-Commerce Stores',
    tagline: 'Shopify stores that sell — from skincare to pet supplies to fitness gear.',
    color: '#22c55e',
    serviceHref: '/services/ecommerce',
  },
  'real-estate': {
    label: 'Realtors & Real Estate',
    tagline: 'Professional sites for luxury realtors, property managers, and boutique agencies.',
    color: '#d4af37',
    serviceHref: '/services/real-estate',
  },
  'law-firms': {
    label: 'Law Firms & Attorneys',
    tagline: 'Authoritative sites for personal injury, family law, criminal defense, and more.',
    color: '#60a5fa',
    serviceHref: '/services/law-firms',
  },
}
