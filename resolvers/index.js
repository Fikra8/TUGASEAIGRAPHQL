// resolvers/index.js

const { UserInputError, ApolloError } = require('apollo-server-express');
const User = require('../models/user');

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.findAll();
      } catch (error) {
        throw new ApolloError('Error fetching users');
      }
    },
    user: async (parent, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new UserInputError('User not found');
        }
        return user;
      } catch (error) {
        throw new ApolloError('Error fetching user');
      }
    }
  },
  Mutation: {
    createUser: async (parent, { name, email }) => {
      // Validasi masukan
      if (!name || !email) {
        throw new UserInputError('Name and email are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new UserInputError('Invalid email format');
      }

      try {
        const user = await User.create({ name, email });
        return user;
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new UserInputError('Email already exists');
        }
        throw new ApolloError('Error creating user');
      }
    },
    updateUser: async (parent, { id, name, email }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new UserInputError('User not found');
        }

        // Validasi masukan
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            throw new UserInputError('Invalid email format');
          }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
        return user;
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new UserInputError('Email already exists');
        }
        throw new ApolloError('Error updating user');
      }
    },
    deleteUser: async (parent, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new UserInputError('User not found');
        }
        await user.destroy();
        return true;
      } catch (error) {
        throw new ApolloError('Error deleting user');
      }
    }
  }
};

module.exports = resolvers;