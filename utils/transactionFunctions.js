const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

const transferFunds = async (amount, destinationAccount) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // If the destination or amount havent been passed then throw an error
      if (!amount) {
        throw new Error("The amount feild is required");
      }
      if (!destinationAccount) {
        throw new Error("The destination feild is required");
      }

      // Get the current users most uptodate balance
      const source = await User.findOne({
        _id: "5f62876441576b09957f511b",
      }).session(session);

      // If the user account dosent exist throw an error
      if (!source) {
        throw new Error("You must be logged in to perform this action");
      }

      // Update the users balance
      source.balance = source.balance - amount;

      // If funds are insufficient, the transfer cannot be processed
      if (source.balance < 0) {
        throw new Error(
          `You have insufficient funds to complete this transaction`
        );
      }

      // Save the updated source into the session  
      await source.save();

    // Get the destination user
      const destination = await User.findOne({
        _id: destinationAccount,
      }).session(session);

    // Update the destination user's balance
      if (destination.balance != null) {
        destination.balance = destination.balance + amount;
      } else {
        destination.balance = amount;
      }

    // Save the updated destination
      await destination.save();

      // Commit the current session
      await session.commitTransaction();

      return destination;

    } catch (error) {
      // Abort the transaction
      await session.abortTransaction();
      return error

    } finally {
      // End the session
      session.endSession();
    }
  }

module.exports = {
    transferFunds
};
