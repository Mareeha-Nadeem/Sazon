import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './categoryCards.css';
import { useNavigate } from 'react-router-dom';

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/menu?category_id=${categoryId}`);
  };

  return (
    <div className="category-container">
      {categories.map(cat => (
        <div key={cat.id} className="category-card" onClick={() => handleClick(cat.id)}>
          <img src={cat.category_image} alt={cat.category} />
          <h3>{cat.category}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryCards;
