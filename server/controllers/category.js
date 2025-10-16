const Category = require("../models/category");

async function getCategories() {
  return await Category.find();
}

async function getCategory(id) {
  return await Category.findById(id);
}

async function addCategory(data) {
  const newCategory = new Category(data);
  await newCategory.save();
  return newCategory;
}

async function updateCategory(id, data) {
  return await Category.findByIdAndUpdate(id, data, { new: true });
}

async function deleteCategory(id) {
  return await Category.findByIdAndDelete(id);
}

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
