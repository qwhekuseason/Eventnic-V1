// @ts-nocheck
import { Link } from 'react-router-dom';
import { memo } from 'react';
import Logo from './Logo';

const Footer = memo(function Footer() {
  return (
    <footer className="w-full pt-xxl pb-lg bg-surface-container-low border-t border-outline-variant">
<div className="max-w-container-max mx-auto px-margin grid grid-cols-2 md:grid-cols-4 gap-lg">
<div className="col-span-2 md:col-span-1">
<div className="mb-md">
  <Logo variant="primary" />
</div>
<p className="text-secondary font-body-sm text-body-sm max-w-xs">Elevating event management through intelligent automation and premium experiences.</p>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-primary mb-md">Product</h4>
<ul className="space-y-sm">
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/explore">Explore Events</Link></li>
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/pricing">Pricing</Link></li>
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/about">About Us</Link></li>
</ul>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-primary mb-md">Support</h4>
<ul className="space-y-sm">
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/help">Help Center</Link></li>
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/contact">Contact Us</Link></li>
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/privacy-policy">Privacy Policy</Link></li>
<li><Link className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" to="/terms-of-service">Terms of Service</Link></li>
</ul>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-primary mb-md">Connect</h4>
<ul className="space-y-sm">
<li><a className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
<li><a className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
<li><a className="text-secondary font-label-sm text-label-sm hover:text-primary transition-all" href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
</ul>
</div>
</div>
<div className="max-w-container-max mx-auto px-margin mt-xl pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
<p className="text-secondary font-body-sm text-body-sm">© 2026 Eventnic Inc. All rights reserved.</p>
<div className="flex gap-lg">
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-all">language</span>
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-all">universal_currency</span>
</div>
</div>
</footer>
  );
});

export default Footer;
