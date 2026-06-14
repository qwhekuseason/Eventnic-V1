import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentFailedEventnic() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[512px] mx-auto px-md"
      >
        <div className="bg-white rounded-[24px] border border-outline-variant shadow-xl p-xl md:p-xxl text-center">
          
          <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto mb-lg">
            <span className="material-symbols-outlined text-red-500 text-[48px]">error</span>
          </div>
          
          <h1 className="font-display text-[32px] text-on-surface mb-sm">Payment Failed</h1>
          
          <p className="text-secondary font-body-md mb-xl">
            We couldn't process your payment. Your card may have been declined, or there might be an issue with your bank. No charges were made.
          </p>

          <div className="bg-surface-container-low rounded-xl p-md mb-xl text-left border border-outline-variant">
            <div className="flex items-center gap-sm mb-xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">credit_card</span>
              <span className="font-label-md text-on-surface">Common reasons for failure:</span>
            </div>
            <ul className="list-disc pl-xl text-secondary font-body-sm space-y-xs mt-sm">
              <li>Insufficient funds or exceeded credit limit.</li>
              <li>Incorrect card number, expiration date, or CVC.</li>
              <li>Your bank blocked the transaction for security reasons.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full sm:w-auto h-14 bg-primary text-white px-xl rounded-xl font-bold font-label-md shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Try Again
            </button>
            <Link 
              to="/event/techpulse-global-2024"
              className="w-full sm:w-auto h-14 bg-surface-container-highest text-on-surface px-xl rounded-xl font-bold font-label-md hover:bg-surface-variant transition-all flex items-center justify-center"
            >
              Cancel Order
            </Link>
          </div>

          <div className="mt-xl pt-lg border-t border-outline-variant text-center">
            <p className="text-secondary font-body-sm">
              Need help? <Link to="/contact" className="text-primary hover:underline font-medium">Contact Support</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
