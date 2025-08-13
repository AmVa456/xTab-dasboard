import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Post, Platform, InsertPost } from "@shared/schema";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  platformId: z.string().min(1, "Platform is required"),
  status: z.enum(["draft", "published", "scheduled", "failed"]),
  scheduledFor: z.string().optional(),
});

type PostFormData = z.infer<typeof postFormSchema>;

interface PostFormProps {
  post?: Post | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const { toast } = useToast();
  const isEditing = !!post;

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      platformId: post?.platformId || "",
      status: (post?.status as "draft" | "published" | "scheduled" | "failed") || "draft",
      scheduledFor: post?.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        platformId: post.platformId,
        status: post.status as "draft" | "published" | "scheduled" | "failed",
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "",
      });
    }
  }, [post, form]);

  const createMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const postData: InsertPost = {
        ...data,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        publishedAt: data.status === "published" ? new Date() : null,
      };
      
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      onSubmit();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const updates = {
        ...data,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        publishedAt: data.status === "published" && post?.status !== "published" ? new Date() : post?.publishedAt,
      };
      
      const response = await apiRequest("PUT", `/api/posts/${post!.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      onSubmit();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PostFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Post" : "Create New Post"}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter post title..."
                    {...field}
                    data-testid="input-post-title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description or excerpt..."
                    {...field}
                    data-testid="input-post-excerpt"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post content..."
                    className="min-h-40"
                    {...field}
                    data-testid="input-post-content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="platformId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 ${platform.color} rounded mr-2`}></div>
                            {platform.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("status") === "scheduled" && (
            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule For</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      data-testid="input-scheduled-for"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              data-testid="button-cancel-post"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="xtab-gradient"
              data-testid="button-submit-post"
            >
              {isPending ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
