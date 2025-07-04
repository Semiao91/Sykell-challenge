import {
  scrapeSchema,
  urlDeleteSchema,
  type ScrapeSchema,
} from "@/schemas/form/scrape.schema";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useNavigate} from "react-router";
import {toast} from "sonner";

const API_URL = `${import.meta.env.VITE_API_URL}/urls`;

export const useScrape = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const scrapeMutation = useMutation({
    mutationFn: async (url: ScrapeSchema) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found.");
      const parsedUrl = scrapeSchema.parse(url);

      const res = await axios.post(
        API_URL + "/",
        {url: parsedUrl.url},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Scrape successful!");
      queryClient.invalidateQueries({queryKey: ["scrapedUrls"]});
    },
    onError: (error: any) => {
      console.error("Scrape error:", error);
      toast.error(error.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found.");
      const parsedId = urlDeleteSchema.parse({id});

      const res = await axios.delete(`${API_URL}/${parsedId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Delete successful!");
      queryClient.invalidateQueries({queryKey: ["scrapedUrls"]});
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast.error(error.message || "Something went wrong");
    },
  });

  const urlsQuery = useQuery({
    queryKey: ["scrapedUrls"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found.");

      const res = await axios.get(API_URL + "/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    handleScrape: scrapeMutation.mutate,
    scrapeStatus: scrapeMutation.status,
    urlsData: urlsQuery.data,
    urlsLoading: urlsQuery.isLoading,
    urlsError: urlsQuery.error,
    refetchUrls: urlsQuery.refetch,
    deleteUrl: deleteMutation.mutate,
    deleteStatus: deleteMutation.status,
  };
};
