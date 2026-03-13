import React, { useState } from 'react';
import { Calendar, User, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NEWS_ARTICLES = [
  {
    id: 1,
    title: 'UAE Launches New Digital Health Initiative for 2026',
    category: 'Healthcare Policy',
    excerpt: 'The UAE Ministry of Health announces a comprehensive digital transformation plan aimed at improving patient care and reducing wait times across all emirates.',
    author: 'Dr. Sarah Al Amiri',
    date: 'March 10, 2026',
    readTime: '5 min read',
    image: 'DH',
    trending: true,
  },
  {
    id: 2,
    title: 'Breakthrough in Diabetes Treatment Shows Promise',
    category: 'Medical Research',
    excerpt: 'Researchers at Dubai Healthcare City announce promising results from a new diabetes treatment that could revolutionize care for millions of patients.',
    author: 'Dr. Ahmed Hassan',
    date: 'March 8, 2026',
    readTime: '4 min read',
    image: 'DR',
    trending: true,
  },
  {
    id: 3,
    title: 'Mental Health Services Expand Across UAE',
    category: 'Mental Health',
    excerpt: 'New mental health clinics open in Dubai and Abu Dhabi, offering teleconsultation and in-person services to meet growing demand.',
    author: 'Dr. Layla Mohammed',
    date: 'March 5, 2026',
    readTime: '3 min read',
    image: 'MH',
    trending: false,
  },
  {
    id: 4,
    title: 'AI-Powered Diagnostics Reduce Wait Times by 40%',
    category: 'Technology',
    excerpt: 'Hospitals in Dubai report significant improvements in diagnostic accuracy and speed following the implementation of AI-assisted imaging.',
    author: 'Tech Health Editor',
    date: 'March 3, 2026',
    readTime: '6 min read',
    image: 'AI',
    trending: true,
  },
  {
    id: 5,
    title: 'New Vaccination Requirements for School Children',
    category: 'Public Health',
    excerpt: 'DHA updates mandatory vaccination schedule for students, adding protection against additional diseases for the 2026-2027 school year.',
    author: 'Ministry of Health',
    date: 'March 1, 2026',
    readTime: '4 min read',
    image: 'PH',
    trending: false,
  },
  {
    id: 6,
    title: 'Telemedicine Usage Increases 300% in UAE',
    category: 'Telemedicine',
    excerpt: 'Virtual consultations become the preferred choice for many patients, with satisfaction rates exceeding 90% according to recent surveys.',
    author: 'Healthcare Analytics Team',
    date: 'February 28, 2026',
    readTime: '5 min read',
    image: 'TM',
    trending: false,
  },
  {
    id: 7,
    title: 'Healthy Living: Expert Tips for Ramadan Wellness',
    category: 'Wellness',
    excerpt: 'Nutritionists and doctors share advice on maintaining health and energy during the holy month of Ramadan.',
    author: 'Dr. Fatima Al Zaabi',
    date: 'February 25, 2026',
    readTime: '7 min read',
    image: 'WL',
    trending: false,
  },
  {
    id: 8,
    title: 'Dubai Hospital Performs First Robotic Heart Surgery',
    category: 'Medical Innovation',
    excerpt: 'Cardiac surgeons at Dubai Heart Center successfully complete the first fully robotic heart bypass surgery in the region.',
    author: 'Dr. Michael Chen',
    date: 'February 22, 2026',
    readTime: '5 min read',
    image: 'CS',
    trending: true,
  },
];

const CATEGORIES = ['All News', 'Healthcare Policy', 'Medical Research', 'Mental Health', 'Technology', 'Public Health', 'Telemedicine', 'Wellness', 'Medical Innovation'];

export function NewsPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All News');

  const filteredNews = NEWS_ARTICLES.filter((article) => {
    return selectedCategory === 'All News' || article.category === selectedCategory;
  });

  const trendingNews = NEWS_ARTICLES.filter(article => article.trending);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Health News & Updates' : 'أخبار وتحديثات صحية'}
          </h1>
          <p className="text-lg opacity-90">
            {language === 'en'
              ? 'Stay informed with the latest healthcare news, research, and wellness tips'
              : 'ابق على اطلاع بأحدث الأخبار والأبحاث الصحية ونصائح العافية'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#0D7377]" />
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Trending Now' : 'الأخبار الرائجة'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingNews.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-full h-24 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-lg flex items-center justify-center text-white text-xl font-bold mb-3">
                  {article.image}
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                  {article.category}
                </span>
                <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">{article.readTime}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Categories' : 'الفئات'}
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#0D7377] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'All News'
                  ? (language === 'en' ? 'Latest News' : 'آخر الأخبار')
                  : selectedCategory}
              </h2>
              <p className="text-gray-600">
                {language === 'en'
                  ? `${filteredNews.length} articles`
                  : `${filteredNews.length} مقالة`}
              </p>
            </div>

            <div className="space-y-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {article.image}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0D7377] bg-opacity-10 text-[#0D7377]">
                          {article.category}
                        </span>
                        {article.trending && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
