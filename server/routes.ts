import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Platform routes
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { platform, status } = req.query;
      
      let posts;
      if (platform && platform !== 'all') {
        posts = await storage.getPostsByPlatform(platform as string);
      } else if (status && status !== 'all') {
        posts = await storage.getPostsByStatus(status as string);
      } else {
        posts = await storage.getPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const post = await storage.updatePost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const success = await storage.deletePost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      const platforms = await storage.getPlatforms();
      
      const totalPosts = posts.length;
      const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
      const publishedPosts = posts.filter(p => p.status === 'published');
      
      const totalEngagement = publishedPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);
      const totalReach = publishedPosts.reduce((sum, post) => sum + post.likes * 5, 0); // Simulated reach calculation
      
      // Find best performing platform
      const platformStats = platforms.map(platform => {
        const platformPosts = publishedPosts.filter(p => p.platformId === platform.id);
        const engagement = platformPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);
        return { platform: platform.name, engagement };
      });
      
      const bestPlatform = platformStats.reduce((best, current) => 
        current.engagement > best.engagement ? current : best
      ).platform;

      const thisWeekPosts = posts.filter(post => {
        const postDate = new Date(post.createdAt!);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return postDate > weekAgo;
      }).length;

      res.json({
        totalPosts,
        scheduledPosts,
        engagement: totalEngagement,
        reach: totalReach > 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(),
        bestPlatform,
        engagementRate: publishedPosts.length > 0 ? `${((totalEngagement / publishedPosts.length) * 0.1).toFixed(1)}%` : "0%",
        postsThisWeek: thisWeekPosts,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
