import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const FoodSearch = () => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMealSelector, setShowMealSelector] = useState(null);

  const mealTypes = [
    { value: 'breakfast', label: '🍳 Breakfast', color: 'bg-orange-100' },
    { value: 'lunch', label: '🥗 Lunch', color: 'bg-green-100' },
    { value: 'dinner', label: '🍽️ Dinner', color: 'bg-blue-100' },
    { value: 'snack', label: '🍎 Snack', color: 'bg-purple-100' },
  ];

  const searchFoods = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Current token before request:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      const response = await axiosInstance.get(`/api/foods/search?q=${query}`);
      console.log('✅ Search response:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('❌ Search failed:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToMeal = async (food, mealType) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await axiosInstance.post('/api/meals', {
        date: today,
        category: mealType,
        foodId: food._id,
        quantity: 100
      });
      alert(`Added ${food.name} to ${mealType}!`);
      setShowMealSelector(null);
    } catch (error) {
      console.error('Failed to add food:', error);
      alert(error.response?.data?.message || 'Failed to add food. Please try again.');
    }
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
                <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 px-3 py-2">Dashboard</Link>
                <Link to="/food-search" className="text-blue-600 font-medium px-3 py-2">Food Search</Link>
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

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Find Foods</h1>
          <form onSubmit={searchFoods} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for foods (e.g., apple, chicken, rice)..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold p-4 border-b">Results ({results.length})</h2>
            {results.map((food) => (
              <div key={food._id} className="p-4 border-b hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{food.name}</h3>
                    {food.brand && <p className="text-sm text-gray-500">{food.brand}</p>}
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>🔥 {food.calories} cal</span>
                      <span>💪 {food.protein}g protein</span>
                      <span>🍚 {food.carbs}g carbs</span>
                      <span>🧈 {food.fat}g fat</span>
                    </div>
                  </div>
                  
                  {showMealSelector === food._id ? (
                    <div className="ml-4">
                      <div className="grid grid-cols-2 gap-2">
                        {mealTypes.map((meal) => (
                          <button
                            key={meal.value}
                            onClick={() => addToMeal(food, meal.value)}
                            className={`${meal.color} px-3 py-2 rounded-lg text-sm hover:opacity-80`}
                          >
                            {meal.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setShowMealSelector(null)}
                          className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowMealSelector(food._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm whitespace-nowrap ml-4"
                    >
                      + Add to Meal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && query && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No foods found for "{query}"</p>
            <p className="text-sm mt-2">Try a different search term.</p>
          </div>
        )}

        {!query && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">🔍 Search for foods to track your meals</p>
            <p className="text-sm mt-2">Try: apple, chicken breast, oatmeal, rice</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSearch;