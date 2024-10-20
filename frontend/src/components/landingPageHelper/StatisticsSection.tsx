import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface StatisticsSectionProps {
  isDarkTheme: boolean;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ isDarkTheme }) => {
  const stats = [
    { title: 'Expert Tutors', endValue: 878, suffix: '+' },
    { title: 'Hours of Content', endValue: 20132, suffix: '+' },
    { title: 'Subjects & Courses', endValue: 232, suffix: '+' },
    { title: 'Active Students', endValue: 72213, suffix: '+' },
  ];

  return (
    <motion.div
      className="mt-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-lg shadow-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-2xl font-bold mb-4">{stat.title}</h3>
            <CountUp
              end={stat.endValue}
              duration={2.5}
              separator=","
              suffix={stat.suffix}
              className="text-4xl font-extrabold text-teal-400"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatisticsSection;
