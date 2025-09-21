import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MessageCircle, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';

export function CrisisModal() {
  const { crisisDetected, setCrisisDetected } = useStore();

  if (!crisisDetected) return null;

  const getCrisisInfo = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          title: 'Immediate Support Available',
          message: 'Your safety is our top priority. Please reach out for immediate help.',
          color: 'bg-red-500',
          resources: [
            { name: 'Suicide & Crisis Lifeline', number: '988', available: '24/7' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
            { name: 'Emergency Services', number: '911', available: '24/7' }
          ]
        };
      case 'high':
        return {
          title: 'Professional Support Recommended',
          message: 'We encourage you to reach out to a mental health professional or trusted person.',
          color: 'bg-orange-500',
          resources: [
            { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
            { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' }
          ]
        };
      default:
        return {
          title: 'Support Resources',
          message: 'Here are some resources that might be helpful.',
          color: 'bg-yellow-500',
          resources: [
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
            { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' }
          ]
        };
    }
  };

  const crisisInfo = getCrisisInfo(crisisDetected.severity);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${crisisInfo.color}`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {crisisInfo.title}
              </h2>
              <p className="text-sm text-gray-600">
                {crisisInfo.message}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setCrisisDetected(null)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Immediate Support Resources:</h3>
          {crisisInfo.resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-800">{resource.name}</p>
                  <p className="text-sm text-gray-600">{resource.number}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{resource.available}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Remember: You're not alone
              </p>
              <p className="text-sm text-blue-700">
                These feelings are temporary, and there are people who want to help you through this difficult time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setCrisisDetected(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            I understand
          </button>
          <button
            onClick={() => {
              // In a real app, this would open the phone dialer
              window.open('tel:988');
            }}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Call 988
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
