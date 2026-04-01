import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDailySummary();
  }, [selectedDate]);

  const fetchDailySummary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/meals/summary?date=${selectedDate}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = summary?.totalCalories || 0;
  const calorieTarget = 2000;
  const percentage = Math.min(100, (totalCalories / calorieTarget) * 100);

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  const mealLabels = {
    breakfast: '🍳 Breakfast',
    lunch: '🥗 Lunch',
    dinner: '🍽️ Dinner',
    snack: '🍎 Snack'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Diet Tracker</span>
              <div className="ml-10 flex space-x-4">
                <Link to="/dashboard" className="text-blue-600 font-medium px-3 py-2">Dashboard</Link>
                <Link to="/food-search" className="text-gray-500 hover:text-blue-600 px-3 py-2">Food Search</Link>
                <Link to="/profile" className="text-gray-500 hover:text-blue-600 px-3 py-2">Profile</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 1);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1"
            />
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + 1);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              →
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Today
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading your nutrition data...</div>
        ) : (
          <>
            {/* Calorie Ring */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Daily Calorie Intake</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={502.4}
                      strokeDashoffset={502.4 * (1 - percentage / 100)}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{totalCalories}</span>
                    <span className="text-sm text-gray-500">/ {calorieTarget} cal</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{Math.round(percentage)}% of daily goal</p>
              </div>
            </div>

            {/* Macronutrients */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Macronutrients</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-600 font-medium">Protein</span>
                    <span>{summary?.totalProtein || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, ((summary?.totalProtein || 0) * 4 / calorieTarget * 100))}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600 font-medium">Carbs</span>
                    <span>{summary?.totalCarbs || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(100, ((summary?.totalCarbs || 0) * 4 / calorieTarget * 100))}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-600 font-medium">Fat</span>
                    <span>{summary?.totalFat || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${Math.min(100, ((summary?.totalFat || 0) * 9 / calorieTarget * 100))}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealOrder.map((meal) => (
                <div key={meal} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">{mealLabels[meal]}</h3>
                    <Link
                      to="/food-search"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add
                    </Link>
                  </div>
                  
                  {summary?.meals?.[meal] && summary.meals[meal].calories > 0 ? (
                    <div>
                      <p className="text-2xl font-semibold text-gray-800">
                        {summary.meals[meal].calories} <span className="text-sm font-normal text-gray-500">cal</span>
                      </p>
                      <div className="flex gap-3 mt-2 text-sm text-gray-500">
                        <span>💪 {summary.meals[meal].protein}g</span>
                        <span>🍚 {summary.meals[meal].carbs}g</span>
                        <span>🧈 {summary.meals[meal].fat}g</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No foods logged yet</p>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State Message */}
            {totalCalories === 0 && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-700">Ready to start tracking?</p>
                <Link to="/food-search" className="inline-block mt-2 text-blue-600 font-medium hover:underline">
                  Search for foods to log →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;