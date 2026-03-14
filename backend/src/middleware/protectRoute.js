import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      // Debug logs
      console.log("🔐 protectRoute middleware START");
      
      const clerkId = req.auth?.userId;
      console.log("clerkId from auth:", clerkId);

      if (!clerkId) {
        console.log("❌ No clerkId found");
        return res.status(401).json({
          message: "Unauthorized - invalid token",
        });
      }

      // 🔴 IMPROVED: Get the REAL email from Clerk
      let realEmail = null;
      
      // Method 1: From emailAddresses array (most common)
      if (req.auth.user?.emailAddresses && req.auth.user.emailAddresses.length > 0) {
        realEmail = req.auth.user.emailAddresses[0].emailAddress;
        console.log("📧 Email from emailAddresses:", realEmail);
      }
      
      // Method 2: From primaryEmailAddress
      if (!realEmail && req.auth.user?.primaryEmailAddress?.emailAddress) {
        realEmail = req.auth.user.primaryEmailAddress.emailAddress;
        console.log("📧 Email from primaryEmailAddress:", realEmail);
      }
      
      // Method 3: From external accounts (Google, GitHub)
      if (!realEmail && req.auth.user?.externalAccounts && req.auth.user.externalAccounts.length > 0) {
        realEmail = req.auth.user.externalAccounts[0].emailAddress;
        console.log("📧 Email from externalAccounts:", realEmail);
      }

      // find user in DB
      console.log("Looking up user with clerkId:", clerkId);
      let user = await User.findOne({ clerkId });
      
      // If user doesn't exist, create them with REAL email
      if (!user) {
        console.log("⚠️ User not found, creating new user...");
        
        const firstName = req.auth.user?.firstName || "";
        const lastName = req.auth.user?.lastName || "";
        const name = `${firstName} ${lastName}`.trim() || "User";
        const profileImage = req.auth.user?.imageUrl || "";
        
        // Use real email if found, otherwise use a placeholder (but log warning)
        const email = realEmail || `user-${clerkId}@example.com`;
        
        if (!realEmail) {
          console.log("⚠️ WARNING: No real email found! Using generated email.");
        }
        
        user = await User.create({
          clerkId: clerkId,
          name: name,
          email: email,
          profileImage: profileImage
        });
        
        console.log("✅ User created with email:", user.email);
      } 
      // If user exists but has fake email and we have real email, update it
      else if (realEmail && user.email !== realEmail) {
        console.log("🔄 Updating user email from", user.email, "to", realEmail);
        user.email = realEmail;
        await user.save();
        console.log("✅ User email updated");
      }
      // If user exists but has no email (unlikely), set it
      else if (!user.email && realEmail) {
        console.log("🔄 Setting missing email to:", realEmail);
        user.email = realEmail;
        await user.save();
        console.log("✅ User email set");
      }

      // attach user to request
      req.user = user;
      console.log("✅ User attached. Email:", user.email);
      console.log("🔐 protectRoute middleware END");

      next();
    } catch (error) {
      console.error("❌ Error in protectRoute middleware:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
];